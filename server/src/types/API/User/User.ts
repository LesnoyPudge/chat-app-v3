


export enum ExtraStatus {
    NONE = '',
    AFK = 'afk',
    DND = 'dnd',
    INVISIBLE = 'invisible',
}

export interface IUserModel {
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    extraStatus: ExtraStatus;
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