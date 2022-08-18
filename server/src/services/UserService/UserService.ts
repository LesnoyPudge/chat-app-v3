import * as bcrypt from 'bcrypt';
import { UserDto } from '@dtos';
import { UserModel } from '@models';
import { IGetOneUserRequest, IUser, ILoginUserRequest, IRegistrationUserRequest, ServiceType, AuthorizedServiceType, IGetManyUserRequest, IUpdateUserRequest, IAuthResponse, IBlockUserRequest, IUnblockUserRequest, ISendFriendRequestUserRequest, IAcceptFriendRequestUserRequest, IDeclineFriendRequestUserRequest, IRevokeFriendRequestUserRequest, IDeleteFriendUserRequest } from '@types';
import { transactionContainer, ApiError, getEnv, token, createAccessCode, objectId, date, sendMail, createActivationLink } from '@utils';
import { subscription } from '@subscription';
import { UserServiceHelpers } from './UserServiceHelpers';



interface IUserService {
    registration: ServiceType<IRegistrationUserRequest, IAuthResponse>;
    login: ServiceType<ILoginUserRequest, IAuthResponse>;
    logout: ServiceType<{refreshToken: string}, void>;
    refresh: ServiceType<{refreshToken: string}, IAuthResponse>;
    getOne: AuthorizedServiceType<IGetOneUserRequest, IUser>;
    getMany: AuthorizedServiceType<IGetManyUserRequest, IUser[]>;
    update: AuthorizedServiceType<IUpdateUserRequest, IUser>;
    blockUser: AuthorizedServiceType<IBlockUserRequest, IUser>;
    unblockUser: AuthorizedServiceType<IUnblockUserRequest, IUser>;
    requestAccessCode: AuthorizedServiceType<unknown, void>;
    sendFriendRequest: AuthorizedServiceType<ISendFriendRequestUserRequest, IUser>;
    acceptFriendRequest: AuthorizedServiceType<IAcceptFriendRequestUserRequest, IUser>;
    declineFriendRequest: AuthorizedServiceType<IDeclineFriendRequestUserRequest, IUser>;
    revokeFriendRequest: AuthorizedServiceType<IRevokeFriendRequestUserRequest, IUser>;
    deleteFriend: AuthorizedServiceType<IDeleteFriendUserRequest, IUser>;
}

const { BCRYPT_SALT_ROUNDS } = getEnv();
const { toObjectId } = objectId;
const { isExpired } = date;
const { sendAccessCode, sendActivationLink } = sendMail;

export const UserService: IUserService = {
    async registration({ email, login, password, username }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT_ROUNDS));
                const hashedPassword = await bcrypt.hash(password, salt);
                const activationLink = createActivationLink();
                const { code, expiryDate } = createAccessCode();

                const user = await UserModel.create(
                    [{
                        email,
                        login,
                        password: hashedPassword,
                        username,
                        activationLink,
                        accessCode: {
                            code,
                            expiryDate,
                        },
                    }],
                    queryOptions(),
                ).then((users) => users[0]).catch(() => {
                    throw ApiError.badRequest('Не удалось зарегистрироваться');
                });

                const tokens = token.generateTokens(UserDto.objectFromModel(user));
                
                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось зарегистрироваться');
                });

                !!email && await sendActivationLink({ to: email, link: '' }).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить письмо с ссылкой для активации');
                });

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );
    },

    async login({ login, password }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findOne({ login }, {}, { lean: true }).catch(() => {
                    throw ApiError.badRequest('Неверный логин или пароль');
                });
        
                const isPassEquals = await bcrypt.compare(password, user.password);
                if (!isPassEquals) {
                    throw ApiError.badRequest('Неверный логин или пароль');
                }

                const tokens = token.generateTokens(UserDto.objectFromModel(user));

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );  
    },

    async logout({ refreshToken }) {
        return transactionContainer(
            async({ onCommit, queryOptions }) => {
                const user = await UserModel.findOneAndUpdate(
                    { refreshJWT: refreshToken },
                    { refreshJWT: '' },
                    queryOptions(),
                ).catch(() => {
                    throw ApiError.badRequest('Не удалось выйти');
                });

                const userDto = UserDto.objectFromModel(user);
                
                onCommit(() => {
                    subscription.users.wentOffline({ entityId: userDto.id });
                });
            },
        );
    },

    async refresh({ refreshToken }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const jwtData = token.validateRefreshToken(refreshToken);
                if (!jwtData) {
                    throw ApiError.forbidden();
                }

                const user = await UserModel.findOne(
                    { 
                        _id: jwtData.id, 
                        refreshJWT: refreshToken, 
                    }, 
                    {}, 
                    { lean: true },
                ).catch(() => {
                    throw ApiError.forbidden();
                });

                const tokens = token.generateTokens(UserDto.objectFromModel(user));

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );
    },

    async getOne({ userId, targetId }) {
        const user = await UserModel.findById(targetId, {}, { lean: true });
        if (!user) throw ApiError.badRequest();

        return UserDto.objectFromModel(user);
    },

    async getMany({ userId, targetIds }) {
        const users = await UserModel.find(
            { _id: { $in: targetIds } }, 
            {}, 
            { lean: true },
        );
        if (users.length === 0) {
            throw ApiError.badRequest('Пользователи не найдены');
        }

        const usersDto = users.map((user) => {
            return UserDto.objectFromModel(user);
        });

        return usersDto;
    },

    async update({ userId, newValues }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId, 
                    newValues, 
                    queryOptions({ new: true }),
                ).catch(() => {
                    throw ApiError.badRequest();
                });

                const updatedUserDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async blockUser({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friends = userToUpdate.friends.filter((friend) => {
                    return friend !== toObjectId(targetId);
                });

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(targetId);
                });

                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(targetId);
                });

                await UserServiceHelpers.removeFriend({ userId: targetId, targetId: userId });
                await UserServiceHelpers.removeIncomingFriendRequest({ userId: targetId, from: userId });
                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: targetId, to: userId });

                userToUpdate.blockList.push(toObjectId(targetId));
                
                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось заблокировать пользователя');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async unblockUser({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { blockList: targetId } },
                    queryOptions({ new: true }),
                );

                const userDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: userDto });
                });

                return userDto;
            },
        );
    },

    async requestAccessCode({ userId }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findById(userId, {}, { lean: true });
                const isAccessCodeExpired = isExpired(user.accessCode.expiryDate);
                const hasEmail = !!user.email;
                const isActivated = user.isActivated;

                if (!hasEmail) throw ApiError.badRequest('Не указана электронная почта');
                if (!isActivated) throw ApiError.badRequest('Аккаунт не активирован');
                if (!isAccessCodeExpired) {
                    return sendAccessCode({ to: user.email, code: user.accessCode.code }).catch(() => {
                        throw ApiError.badRequest('Не удалось отправить код доступа');
                    });
                }
                
                const { code, expiryDate } = createAccessCode();

                user.accessCode = {
                    code,
                    expiryDate,
                };

                await user.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить код доступа');
                });

                await sendAccessCode({ to: user.email, code }).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить код доступа');
                });
            },
        );
    },

    async sendFriendRequest({ userId, to }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.outgoing.push({
                    to: toObjectId(to),
                    createdAt: new Date(),
                });

                await UserServiceHelpers.addIncomingFriendRequest({ userId: to, from: userId });

                userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отправить запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async acceptFriendRequest({ userId, from }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(from);
                });
                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(from);
                });
                userToUpdate.friends.push(toObjectId(from));

                await UserServiceHelpers.addFriend({ userId: from, targetId: userId });
                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: from, to: userId });
                await UserServiceHelpers.removeIncomingFriendRequest({ userId: from, from: userId });

                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось принять запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async declineFriendRequest({ userId, from }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.incoming = userToUpdate.friendRequests.incoming.filter((incomingRequest) => {
                    return incomingRequest.from !== toObjectId(from);
                });

                await UserServiceHelpers.removeOutgoingFriendRequest({ userId: from, to: userId });

                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отклонить запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async revokeFriendRequest({ userId, to }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const userToUpdate = await UserModel.findById(userId, {}, { lean: true });

                userToUpdate.friendRequests.outgoing = userToUpdate.friendRequests.outgoing.filter((outgoingRequest) => {
                    return outgoingRequest.to !== toObjectId(to);
                });

                await UserServiceHelpers.removeIncomingFriendRequest({ userId: to, from: userId });

                await userToUpdate.save(queryOptions()).catch(() => {
                    throw ApiError.badRequest('Не удалось отозвать запрос в друзья');
                });

                const updatedUserDto = UserDto.objectFromModel(userToUpdate);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },

    async deleteFriend({ userId, targetId }) {
        return transactionContainer(
            async({ queryOptions, onCommit }) => {
                const updatedUser = await UserModel.findByIdAndUpdate(
                    userId,
                    { $pull: { friends: targetId } },
                    queryOptions({ new: true }),
                );

                await UserServiceHelpers.removeFriend({ userId: targetId, targetId: userId });

                const updatedUserDto = UserDto.objectFromModel(updatedUser);

                onCommit(() => {
                    subscription.users.update({ entity: updatedUserDto });
                });

                return updatedUserDto;
            },
        );
    },
};