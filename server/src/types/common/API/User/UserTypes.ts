


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
        fontSize: 12 | 14 | 16 | 18 | 20;
        messageGroupSpacing: 16 | 20;
        transitionSpeed: 0 | 0.5 | 1 | 1.5 | 2;
    };
    accessCode: {
        code: string;
        expiryDate: string;
    };
    channels: string[];
    privateChannels: string[];
    createdAt: string;
    updatedAt: string;
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