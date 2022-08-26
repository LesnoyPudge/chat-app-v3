import { UserDto } from '@dtos';
import { IUserModel, UserModel } from '@models';
import { ApiError, createAccessCode, getRandomString, objectId, password, token, transactionContainer } from '@utils';
import { FilterQuery, Types } from 'mongoose';
import { subscription } from '@subscription';
import { AttachmentServiceHelpers } from '../AttachmentService';



const { toObjectId } = objectId;
// const { hashPassword } = password;
// const { getUUID } = getRandomString;
// const { generateTokens } = token;

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

    async addFriend({ userId, targetId }: {userId: string, targetId: string}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { $push: { friends: toObjectId(targetId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });
            },
        );
    },

    async removeFriend({ userId, targetId }: {userId: string, targetId: string}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { friends: toObjectId(targetId) } },
                    queryOptions({ new: true }),
                );

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(updatedUser) });
                });
            },
        );
    },

    async addIncomingFriendRequest({ userId, from }: {userId: string, from: string}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });
                
                userToUpdate.friendRequests.incoming.push({
                    from: toObjectId(from),
                    createdAt: new Date(),
                });

                await userToUpdate.save(queryOptions());

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(userToUpdate) });
                });
            },
        );
    },

    async removeIncomingFriendRequest({ userId, from }: {userId: string, from: string}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });
                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(from);
                });

                await userToUpdate.save(queryOptions());

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(userToUpdate) });
                });
            },
        );
    },

    async addOutgoingFriendRequest({ userId, to }: {userId: string, to: string}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });
                
                userToUpdate.friendRequests.outgoing.push({
                    to: toObjectId(to),
                    createdAt: new Date(),
                });

                await userToUpdate.save(queryOptions());

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(userToUpdate) });
                });
            },
        );
    },

    async removeOutgoingFriendRequest({ userId, to }: {userId: string, to: string}) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });
                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(to);
                });

                await userToUpdate.save(queryOptions());

                onCommit(() => {
                    subscription.users.update({ entity: UserDto.objectFromModel(userToUpdate) });
                });
            },
        );
    },

    async isUserExist(filter: FilterQuery<IUserModel>) {
        return !!await UserModel.exists(filter);
    },

    async getOne(filter: FilterQuery<IUserModel>) {
        return await UserModel.findOne(filter, {}, { lean: true });
    },

    async isUsersExists(filter: FilterQuery<IUserModel>) {
        return await UserModel.find(filter, '_id', { lean: true });
    },

    // async createTestUser() {
    //     return transactionContainer(
    //         async({ queryOptions }) => {
    //             const hashedPassword = await hashPassword('testUserPassword');
    //             const activationCode = getUUID();
    //             const { code, expiryDate } = createAccessCode();
    //             const attachment = await AttachmentServiceHelpers.getDefaultUserAvatar();
    //             const login = getUUID();

    //             const testUser = await UserModel.create(
    //                 [{
    //                     avatar: attachment.id,
    //                     login,
    //                     password: hashedPassword,
    //                     username: login,
    //                     activationCode,
    //                     accessCode: {
    //                         code,
    //                         expiryDate,
    //                     },
    //                 }],
    //                 queryOptions(),
    //             ).then((users) => users[0]);

    //             const tokens = generateTokens(UserDto.objectFromModel(testUser));

    //             return {
    //                 user: UserDto.objectFromModel(testUser),
    //                 ...tokens,
    //             };
    //         },
    //     );
    // },
};