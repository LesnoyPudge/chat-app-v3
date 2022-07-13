import { HydratedDocument } from 'mongoose';
import { IUserModel } from '../../models';



interface IUser {
    id: string;
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserSomePreset {
    id: string;
    login: string;
    username: string;
    avatar: string;
}

type IUserDoc = HydratedDocument<IUserModel>;

interface IUserDto {
    defaultPreset: (user: IUserDoc) => IUser;
    somePreset: (user: IUserDoc) => IUserSomePreset;
}

export const UserDto: IUserDto = {
    defaultPreset(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            username: user.username,
            password: user.password,
            avatar: user.avatar,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    somePreset(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            username: user.username,
            avatar: user.avatar,
        };
    },
};