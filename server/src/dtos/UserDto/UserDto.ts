import { HydratedDocument } from 'mongoose';
import { IUser } from '@types';
import { IUserModel } from '@models';



type IUserDoc = HydratedDocument<IUserModel>;

interface IUserDto {
    objectFromModel: (user: IUserDoc) => IUser;
    defaultPreset: (user: IUserDoc | any) => IUser;
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
            activationLink: user.activationLink,
            isActivated: user.isActivated,
            settings: user.settings,
            refreshJWT: user.refreshJWT,
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
            activationLink: user?.activationLink,
            isActivated: user?.isActivated,
            settings: user?.settings,
            refreshJWT: user?.refreshJWT,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt,
        };
    },
};