import { PrivateChannelDto } from '@dtos';
import { PrivateChannelModel } from '@models';
import { AuthorizedServiceType, ICreatePrivateChannelRequest, ILeavePrivateChannelRequest, IGetOnePrivateChannelRequest, IPrivateChannel } from '@types';
import { ApiError, objectId, transactionContainer } from '@utils';
import { PrivateChannelServiceHelpers, UserServiceHelpers, MessageServiceHelpers } from '@services';
import { subscription } from '@subscription';



interface IPrivateChannelService {
    create: AuthorizedServiceType<ICreatePrivateChannelRequest, IPrivateChannel>;
    getOne: AuthorizedServiceType<IGetOnePrivateChannelRequest, IPrivateChannel>;
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
                    ).then((privateChannels) => privateChannels[0]);
    
                    await UserServiceHelpers.addPrivateChannel({ userId, privateChannelId: privateChannel._id });
                    
                    return PrivateChannelDto.objectFromModel(privateChannel);
                }
            },
        );
    },

    async getOne({ userId, privateChannelId }) {
        const privateChannel = await PrivateChannelModel.findById(privateChannelId, {}, { lean: true });
        return PrivateChannelDto.objectFromModel(privateChannel);
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
                );

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