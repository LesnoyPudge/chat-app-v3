import { PrivateChannelDto } from '@dtos';
import { PrivateChannelModel } from '@models';
import { AuthorizedServiceType, ICreatePrivateChannelRequest, ILeavePrivateChannelRequest, IGetManyPrivateChannelsRequest, IGetOnePrivateChannelRequest, IPrivateChannel, IUpdatePrivateChannelRequest } from '@types';
import { ApiError, objectId, transactionContainer } from '@utils';
import { PrivateChannelServiceHelpers, UserServiceHelpers, MessageServiceHelpers } from '@services';
import { subscription } from '@subscription';



interface IPrivateChannelService {
    create: AuthorizedServiceType<ICreatePrivateChannelRequest, IPrivateChannel>;
    getOne: AuthorizedServiceType<IGetOnePrivateChannelRequest, IPrivateChannel>;
    // getMany: AuthorizedServiceType<IGetManyPrivateChannelsRequest, IPrivateChannel[]>;
    update: AuthorizedServiceType<IUpdatePrivateChannelRequest, IPrivateChannel>;
    leave: AuthorizedServiceType<ILeavePrivateChannelRequest, IPrivateChannel>;
}

const { toObjectId } = objectId;

export const PrivateChannelService: IPrivateChannelService = {
    async create({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const filter = { $in: { members: [userId, targetId] } };
                const isExist = await PrivateChannelServiceHelpers.isExist({ filter });
                const existingPrivateChannel = isExist && await PrivateChannelModel.findOne(filter, {}, { lean: true });
                const isActiveMember = existingPrivateChannel.activeMembers.includes(toObjectId(userId));

                if (isExist && !isActiveMember) {
                    const updatedPrivateChannel = await PrivateChannelModel.findByIdAndUpdate(
                        existingPrivateChannel._id,
                        { $push: { activeMembers: toObjectId(userId) } },
                        queryOptions({ new: true }),
                    );

                    await UserServiceHelpers.addPrivateChannel({ userId, privateChannelId: updatedPrivateChannel._id });

                    return PrivateChannelDto.objectFromModel(updatedPrivateChannel);
                }

                if (isExist && isActiveMember) {
                    return PrivateChannelDto.objectFromModel(existingPrivateChannel);
                }

                if (!isExist) {
                    const privateChannel = await PrivateChannelModel.create(
                        [{
                            members: [
                                userId,
                                targetId,
                            ],
                            activeMembers: [
                                userId,
                            ],
                        }],
                        queryOptions(),
                    ).then((privateChannels) => privateChannels[0]).catch(() => {
                        throw ApiError.badRequest('Не удалось создать канал');
                    });
    
                    await UserServiceHelpers.addPrivateChannel({ userId, privateChannelId: privateChannel._id });
                    
                    return PrivateChannelDto.objectFromModel(privateChannel);
                }
            },
        );
    },

    async getOne({ userId, privateChannelId }) {
        const privateChannel = await PrivateChannelModel.findById(privateChannelId, {}, { lean: true });
        if (!privateChannel) throw ApiError.badRequest('Канал не найден');

        const privateChannelDto = PrivateChannelDto.objectFromModel(privateChannel);
        return privateChannelDto;
    },

    // async getMany({ userId, privateChannelIds }) {
    //     const privateChannels = await PrivateChannelModel.find({ _id: { $in: privateChannelIds } }, {}, { lean: true });
    //     if (!privateChannels.length) {
    //         throw ApiError.badRequest('Каналы не найдены');
    //     }

    //     const privateChannelDtos = privateChannels.map((privateChannel) => {
    //         return PrivateChannelDto.objectFromModel(privateChannel);
    //     });

    //     return privateChannelDtos;
    // },

    async update({ userId, privateChannelId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedPrivateChannel = await PrivateChannelModel.findByIdAndUpdate(
                    privateChannelId,
                    newValues,
                    queryOptions({ new: true }),
                );
                if (!updatedPrivateChannel) throw ApiError.badRequest('Не удалось обновить канал');

                const updatedPrivateChannelDto = PrivateChannelDto.objectFromModel(updatedPrivateChannel);

                onCommit(() => {
                    subscription.privateChannels.update({ entity: updatedPrivateChannelDto });
                });

                return updatedPrivateChannelDto;
            },
        );
    },

    async leave({ userId, privateChannelId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedPrivateChannel = await PrivateChannelModel.findByIdAndUpdate(
                    privateChannelId,
                    {
                        $pull: { activeMembers: userId },
                    },
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest('Канал не найден');
                });

                await UserServiceHelpers.removePrivateChannel({ userId, privateChannelId });

                const isZeroActiveMembers = updatedPrivateChannel.activeMembers.length === 0;
                if (isZeroActiveMembers) {
                    const deletedPrivateChannel = await PrivateChannelModel.findOneAndDelete(
                        { _id: privateChannelId }, 
                        queryOptions(),
                    );
                    
                    await MessageServiceHelpers.deleteManyByChatId({ chatId: deletedPrivateChannel.chat._id });
                    
                    const deletedPrivateChannelDto = PrivateChannelDto.objectFromModel(deletedPrivateChannel);
                    
                    onCommit(() => {
                        subscription.privateChannels.delete({ entityId: deletedPrivateChannelDto.id });
                    });

                    return deletedPrivateChannelDto;
                }

                const updatedPrivateChannelDto = PrivateChannelDto.objectFromModel(updatedPrivateChannel); 

                onCommit(() => {
                    subscription.privateChannels.update({ entity: updatedPrivateChannelDto });
                });

                return updatedPrivateChannelDto;
            },
        );
    },
};