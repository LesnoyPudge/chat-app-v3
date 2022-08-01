


export interface IUser {
    id: string;
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    extraStatus: 'default' | 'afk' | 'dnd' | 'invisible';
    activationLink: string;
    isActivated: boolean;
    settings: {
        theme: 'auto' | 'dark' | 'light';
        fontSize: number;
        messageGroupSpacing: number;
        transitionSpeed: number;
    }
    createdAt: Date;
    updatedAt: Date;
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