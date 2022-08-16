import { UserDto } from '@dtos';
import { UserModel } from '@models';
import { objectId, transactionContainer } from '@utils';
import { Types } from 'mongoose';
import { subscription } from '@subscription';



const { toObjectId } = objectId;

export const UserServiceHelpers = {
    async addChannel({ userId, channelId }: {userId: string, channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    { $push: { channels: toObjectId(channelId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });

                return updatedUser;
            },
        );
    },

    async removeChannel({ userId, channelId }: {userId: string, channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    { channels: channelId }, 
                    { $pull: { channels: channelId } }, 
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });

                return updatedUser;
            },
        );
    },

    async removeChannelFromMany({ channelId }: {channelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const usersToUpdate = await UserModel.find({ channels: channelId });
                
                const updatedUsers = await Promise.all(usersToUpdate.map(async(user) => {
                    user.channels = user.channels.filter((itemId) => itemId !== toObjectId(channelId));
                    await user.save(queryOptions());

                    onCommit(() => {
                        subscription.users.update({ entity: UserDto.objectFromModel(user) });
                    });

                    return user;
                }));

                return updatedUsers;
            },
        );
    },

    async addPrivateChannel({ userId, privateChannelId }: {userId: string, privateChannelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    { $push: { privateChannels: toObjectId(privateChannelId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });

                return updatedUser;
            },
        );
    },

    async removePrivateChannel({ userId, privateChannelId }: {userId: string, privateChannelId: string | Types.ObjectId}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    { $pull: { privateChannels: privateChannelId } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });

                return updatedUser;
            },
        );
    },
};