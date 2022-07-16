import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { UserDto } from '../../dtos';
import { UserModel } from '../../models';
import { AuthorizedServiceType, IGetUserReq, IUser , IUserLoginReq, IUserRegistrationReq, ServiceType } from '../../types';
import { transactionContainer, ApiError, getEnvVars, token } from '../../utils';
import { subscription } from '../../socket/features';



interface IUserService {
    registration: ServiceType<IUserRegistrationReq, {
        user: IUser;
        refreshToken: string;
        accessToken: string;
    }>;
    login: ServiceType<IUserLoginReq, {
        user: IUser;
        refreshToken: string;
        accessToken: string;
    }>;
    logout: AuthorizedServiceType<unknown, void>;
    get: ServiceType<IGetUserReq, IUser>;
    // update: ServiceType<IUserRegistrationReq, IUser>;
}

export const UserService: IUserService = {
    async registration({ email, login, password, username }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                const hashedPassword = await bcrypt.hash(password, getEnvVars().BCRYPT_SALT);
                const activationLink = uuid.v4(); 
                const user = new UserModel({
                    email, 
                    login, 
                    password: hashedPassword, 
                    username,
                    activationLink,
                });
                const tokens = token.generateTokens({
                    id: user.id,
                    login: user.login,
                    password: user.password,
                });

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );
    },

    async login({ login, password }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findOne({ login });
                if (!user) {
                    throw ApiError.badRequest('Неверный логин или пароль');
                }
        
                const isPassEquals = await bcrypt.compare(password, user.password);
                if (!isPassEquals) {
                    throw ApiError.badRequest('Неверный логин или пароль');
                }
                const tokens = token.generateTokens({
                    id: user.id,
                    login: user.login,
                    password: user.password,
                });

                user.refreshJWT = tokens.refreshToken;

                await user.save(queryOptions());

                return {
                    user: UserDto.objectFromModel(user),
                    ...tokens,
                };
            },
        );  
    },

    async logout({ authData }) {
        return await transactionContainer(
            async({ onCommit, queryOptions }) => {
                await UserModel.updateOne(
                    { _id: authData.userId },
                    { refreshJWT: '' },
                    queryOptions(),
                );

                onCommit(() => {
                    subscription.wentOffline(authData.userId);
                });
            },
        );
    },

    async get({ targetId }) {
        return await transactionContainer(
            async({ queryOptions }) => {
                const user = await UserModel.findById(targetId, {}, queryOptions());
                if (!user) throw ApiError.badRequest(); // do delete?

                return UserDto.objectFromModel(user);
            },
        );
    },

    // async update({ userId, username }) {
    //     return await transactionContainer(
    //         async({ queryOptions, onCommit }) => {
    //             console.log(userId, username);
    //             const updatedUser = await UserModel.findOneAndUpdate(
    //                 { _id: userId }, 
    //                 { username }, 
    //                 queryOptions({ new: true }),
    //             );
    //             if (!updatedUser) {
    //                 throw ApiError.badRequest();
    //             }

    //             onCommit(() => {
    //                 subscription.update(UserDto.objectFromModel(updatedUser));
    //             });

    //             return updatedUser;
    //         },
    //     );
    // },
};