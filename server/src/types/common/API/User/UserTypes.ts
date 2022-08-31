


type ExtraStatusType = 'default' | 'afk' | 'dnd' | 'invisible';

export interface IUserSettings {
    theme: 'auto' | 'dark' | 'light';
    fontSize: 12 | 14 | 16 | 18 | 20;
    messageGroupSpacing: 16 | 20;
    transitionSpeedModifier: 0 | 0.5 | 1 | 1.5 | 2;
}

export interface IUser {
    id: string;
    login: string;
    username: string;
    avatar: string;
    email: string;
    extraStatus: ExtraStatusType;
    isActivated: boolean;
    settings: IUserSettings;
    blockList: string[];
    channels: string[];
    privateChannels: string[];
    friendRequests: {
        incoming: {
            from: string;
            createdAt: string;
        }[];
        outgoing: {
            to: string;
            createdAt: string;
        }[];
    };
    createdAt: string;
    updatedAt: string;
}

export interface IUserPreview {
    id: string;
    username: string;
    avatar: string;
    extraStatus: ExtraStatusType;
    status: 'online' | 'offline';
}

export interface IRegistrationUserRequest {
    login: string;
    username: string;
    password: string;
    email?: string;
}

export interface ILoginUserRequest {
    login: string;
    password: string;
}

export interface IGetOneUserRequest {
    targetId: string;
}
export interface IAuthResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IProfileUpdateUserRequest {
    username?: string;
    avatar?: {
        filename: string;
        base64url: string;
    };
    settings?: Partial<IUserSettings>;
    extraStatus?: ExtraStatusType;
}

export interface ICredentialsUpdateUserRequest {
    password: string;
    accessCode: string;
    newPassword?: string;
    newEmail?: string;
    newLogin?: string;
}

export interface IBlockUserRequest {
    targetId: string;
}

export interface IUnblockUserRequest {
    targetId: string;
}

export interface ISendFriendRequestUserRequest {
    to: string;
}

export interface IAcceptFriendRequestUserRequest {
    from: string;
}

export interface IDeclineFriendRequestUserRequest {
    from: string;
}

export interface IRevokeFriendRequestUserRequest {
    to: string;
}

export interface IDeleteFriendUserRequest {
    targetId: string;
}

export interface IActivateAccountUserRequest {
    activationCode: string;
}

export interface IVerifyAccessCodeUserReuqest {
    accessCode: string;
}