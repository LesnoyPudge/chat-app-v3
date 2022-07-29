import { IUserModel } from '@models';



export interface IUser extends IUserModel {
    id: string;
}

export interface IUserWithStatus extends IUser {
    status: 'online' | 'offline';
}

export interface IUserRegistrationReq {
    login: string;
    username: string;
    password: string;
    email: string;
}

export interface IUserLoginReq {
    login: string;
    password: string;
}

export interface IGetUserReq {
    targetId: string;
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string;
}