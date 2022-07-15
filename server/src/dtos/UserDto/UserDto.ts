import { HydratedDocument } from 'mongoose';
import { IUser } from '../../types/API/User';



interface IUserSomePreset {
    id: string;
    login: string;
    username: string;
    avatar: string;
}

type IUserDoc = HydratedDocument<IUser>;

interface IUserDto {
    objectFromModel: (user: IUserDoc) => IUser;
    defaultPreset: (user: IUserDoc | any) => IUser;
    somePreset: (user: IUserDoc | any) => IUserSomePreset;
}

export const UserDto: IUserDto = {
    objectFromModel(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            username: user.username,
            password: user.password,
            avatar: user.avatar,
            email: user.email,
            extraStatus: user.extraStatus,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
    defaultPreset(user) {
        return {
            id: user?.id,
            login: user?.login,
            username: user?.username,
            password: user?.password,
            avatar: user?.avatar,
            email: user?.email,
            extraStatus: user?.extraStatus,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt,
        };
    },

    somePreset(user) {
        return {
            id: user?.id,
            login: user?.login,
            username: user?.username,
            avatar: user?.avatar,
        };
    },
};