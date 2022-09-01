import { ChannelDto } from '@dtos';
import { ChannelModel } from '@models';
import { subscription } from '@subscription';
import { AuthorizedServiceType, IAcceptInvitationChannelRequest, IBanUserChannelRequest, IChannel, ICreateChannelRequest, ICreateInvitationChannelRequest, IDeleteChannelRequest, IDeleteInvitationChannelRequest, IGetOneChannelRequest, IKickUserChannelRequest, ILeaveChannelRequest, IUnbanUserChannelRequest, IUpdateChannelRequest } from '@types';
import { ApiError, getRandomString, objectId, transactionContainer } from '@utils';
import { UserServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, FileServiceHelpers } from '@services';



interface IChannelService {
    create: AuthorizedServiceType<ICreateChannelRequest, IChannel>;
    getOne: AuthorizedServiceType<IGetOneChannelRequest, IChannel>;
    // getMany: AuthorizedServiceType<IGetManyChannelsRequest, IChannel[]>;
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
const { getOnlyLettersString } = getRandomString;

export const ChannelService: IChannelService = {
    async create({ name, identifier, userId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
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

                const room = await RoomServiceHelpers.createDefaultRoom({ channelId: channel._id });
                channel.rooms = [room._id];

                await channel.save(queryOptions());

                return ChannelDto.objectFromModel(channel);
            },
        );
    },

    async getOne({ channelId }) {
        const channel = await ChannelModel.findById(channelId, {}, { lean: true });

        return ChannelDto.objectFromModel(channel);
    },

    async update({ userId, channelId, avatar, name }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const channelToUpdate = await ChannelModel.findById(channelId, {}, { lean: true });
                const isntEmptyAvatar = avatar && avatar.filename && avatar.base64url;
                const isEmptyAvatar = avatar && !avatar.filename || !avatar.base64url;

                if (name) channelToUpdate.name = name;
                
                if (avatar) await FileServiceHelpers.delete({ attachmentId: channelToUpdate.avatar });
                if (isEmptyAvatar) channelToUpdate.avatar = '';
                if (isntEmptyAvatar) {
                    const newAvatar = await FileServiceHelpers.create({
                        type: 'avatar',
                        base64url: avatar.base64url, 
                        filename: avatar.filename,
                    });
                    channelToUpdate.avatar = newAvatar.id;
                }

                await channelToUpdate.save(queryOptions());

                const updatedChannelDto = ChannelDto.objectFromModel(channelToUpdate);

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

                await UserServiceHelpers.removeChannelFromMany({ channelId });
                await RoleServiceHelpers.deleteManyByChannelId({ channelId });
                await RoomServiceHelpers.deleteManyByChannelId({ channelId });
                
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
                );

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
                );

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
                );

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

                await channel.save(queryOptions());

                const updatedChannelDto = ChannelDto.objectFromModel(channel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },
    
    async createInvitation({ userId, channelId, duration, code = getOnlyLettersString(10) }) {
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
                );

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
                );

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

                await channel.save(queryOptions());

                const updatedChannelDto = ChannelDto.objectFromModel(channel);

                onCommit(() => {
                    subscription.channels.update({ entity: updatedChannelDto });
                });

                return updatedChannelDto;
            },
        );
    },
};