

interface ISettings {
    theme: 'auto' | 'dark' | 'light';
    fontSize: number;
    messageGroupSpacing: number;
    transitionSpeed: number;
}

export interface IUserModel {
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    extraStatus: 'default' | 'afk' | 'dnd' | 'invisible';
    activationLink: string;
    isActivated: boolean;
    settings: ISettings;
    refreshJWT: string; 
    createdAt: Date;
    updatedAt: Date;
    // friendRequests: Types.ObjectId[];
    // privateChats: Types.ObjectId[];
    // blockList: Types.ObjectId[];
    // appSettings: Types.ObjectId;
    // channels: Types.ObjectId[];
    // roles: Types.ObjectId[];
}

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