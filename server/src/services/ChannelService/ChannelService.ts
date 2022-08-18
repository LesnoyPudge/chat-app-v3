import { ChannelDto } from '@dtos';
import { ChannelModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, IAcceptInvitationChannelRequest, IBanUserChannelRequest, IChannel, ICreateChannelRequest, ICreateInvitationChannelRequest, IDeleteChannelRequest, IDeleteInvitationChannelRequest, IGetManyChannelsRequest, IGetOneChannelRequest, IKickUserChannelRequest, ILeaveChannelRequest, IUnbanUserChannelRequest, IUpdateChannelRequest } from '@types';
import { ApiError, generateString, objectId, transactionContainer } from '@utils';
import { UserServiceHelpers, RoleServiceHelpers, TextRoomServiceHelpers } from '@services';
import c from 'config';



interface IChannelService {
    create: AuthorizedServiceType<ICreateChannelRequest, IChannel>;
    getOne: AuthorizedServiceType<IGetOneChannelRequest, IChannel>;
    getMany: AuthorizedServiceType<IGetManyChannelsRequest, IChannel[]>;
    update: AuthorizedServiceType<IUpdateChannelRequest, IChannel>;
    delete: AuthorizedServiceType<IDeleteChannelRequest, IChannel>;
    leave: AuthorizedServiceType<ILeaveChannelRequest, IChannel>;
    kickUser: AuthorizedServiceType<IKickUserChannelRequest, IChannel>;
    banUser: AuthorizedServiceType<IBanUserChannelRequest, IChannel>;
    unbanUser: AuthorizedServiceType<IUnbanUserChannelRequest, IChannel>;
    createInvitation: AuthorizedServiceType<ICreateInvitationChannelRequest, IChannel>;
    acceptInvitation: AuthorizedServiceType<IAcceptInvitationChannelRequest, IChannel>;
    deleteInvitation: AuthorizedServiceType<IDeleteInvitationChannelRequest, IChannel>;
}

const { toObjectId } = objectId;

export const ChannelService: IChannelService = {
    async create({ name, identifier, userId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const isChannelExist = await ChannelModel.exists({ identifier });
                if (isChannelExist) {
                    throw ApiError.badRequest('Канал с данным идентификатором уже существует');
                }

                const channel = new ChannelModel({
                    identifier,
                    name,
                    owner: userId,
                    members: [userId],
                });

                await UserServiceHelpers.addChannel({ userId, channelId: channel._id });
                
                const defaulRole = await RoleServiceHelpers.createDefaultRole({ userId, channelId: channel._id });
                const adminRole = await RoleServiceHelpers.createAdminRole({ userId, channelId: channel._id });
                channel.roles = [adminRole._id, defaulRole._id];

                const textRoom = await TextRoomServiceHelpers.createDefaultTextRoom({ channelId: channel._id });
                channel.textRooms = [textRoom._id];

                await channel.save(queryOptions());

                const channelDto = ChannelDto.objectFromModel(channel);
                return channelDto;
            },
        );
    },

    async getOne({ channelId }) {
        const channel = await ChannelModel.findById(channelId, {}, { lean: true });
        if (!channel) {
            throw ApiError.badRequest('Канал не найден');
        }

        const channelDto = ChannelDto.objectFromModel(channel);
        return channelDto;
    },

    async getMany({ channelIds }) {
        const channels = await ChannelModel.find({ _id: { $in: channelIds } }, {}, { lean: true });
        if (!channels.length) {
            throw ApiError.badRequest('Каналы не найдены');
        }

        const channelDtos = channels.map((channel) => {
            return ChannelDto.objectFromModel(channel);
        });

        return channelDtos;
    },

    async update({ userId, channelId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    newValues, 
                    queryOptions({ new: true }),
                );
                if (!updatedChannel) {
                    throw ApiError.badRequest('Не удалось обновить канал');
                }

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async delete({ channelId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const deletedChannel = await ChannelModel.findByIdAndDelete(channelId, queryOptions());
                if (!deletedChannel) {
                    throw ApiError.badRequest('Не удалось удалить канал');
                }

                await UserServiceHelpers.removeChannelFromMany({ channelId });
                await RoleServiceHelpers.deleteManyByChannelId({ channelId });
                await TextRoomServiceHelpers.deleteManyByChannelId({ channelId });
                
                onCommit(() => {
                    subscription.channels.delete({ entityId: channelId });
                });

                const deletedChannelDto = ChannelDto.objectFromModel(deletedChannel);
                return deletedChannelDto;
            },
        );
    },

    async leave({ userId, channelId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    { $pull: { members: userId } },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось покинуть канал');
                });

                await UserServiceHelpers.removeChannel({ userId, channelId });

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async kickUser({ userId, channelId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    { $pull: { members: targetId } },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось выгнать пользователя');
                });

                await UserServiceHelpers.removeChannel({ userId: targetId, channelId });

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async banUser({ userId, channelId, targetId, reason = 'Причина не указана' }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId, 
                    { 
                        $pull: { members: targetId },
                        $push: { banList: {
                            user: toObjectId(targetId),
                            reason,
                        } },
                    },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось забанить пользователя');
                });

                await UserServiceHelpers.removeChannel({ userId: targetId, channelId });

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async unbanUser({ userId, channelId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const channel = await ChannelModel.findById(channelId, {}, { lean: true });

                channel.banList = channel.banList.filter((banEntity) => {
                    banEntity.user !== toObjectId(targetId);
                });

                await channel.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось разбанить пользователя');
                });

                const updatedChannelDto = ChannelDto.objectFromModel(channel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },
    
    async createInvitation({ userId, channelId, duration, code = generateString(10) }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const createdAt = Date.now();
                const expiryDate = createdAt + duration;

                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId,
                    { $push: { invitations: {
                        creator: toObjectId(userId),
                        code,
                        expiryDate: new Date(expiryDate),
                        createdAt: new Date(createdAt),
                    } } },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось создать приглашение');
                });

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async acceptInvitation({ userId, channelId, code }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedChannel = await ChannelModel.findByIdAndUpdate(
                    channelId,
                    { $push: { members: toObjectId(userId) } },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось принять приглашение');
                });

                const updatedChannelDto = ChannelDto.objectFromModel(updatedChannel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },

    async deleteInvitation({ userId, channelId, code }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const channel = await ChannelModel.findById(channelId, {}, { lean: true });
                
                channel.invitations = channel.invitations.filter((invitation) => {
                    invitation.code !== code;
                });

                await channel.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось разбанить пользователя');
                });

                const updatedChannelDto = ChannelDto.objectFromModel(channel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },
};