


type ExtraStatusType = 'default' | 'afk' | 'dnd' | 'invisible';

export interface IUser {
    id: string;
    login: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    extraStatus: ExtraStatusType;
    activationCode: string;
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

export interface IUserWithStatus extends IUser {
    status: 'online' | 'offline';
}

export interface IRegistrationUserRequest {
    login: string;
    username: string;
    password: string;
    email: string;
}

export interface ILoginUserRequest {
    login: string;
    password: string;
}

export interface IGetOneUserRequest {
    targetId: string;
}

export interface IGetManyUserRequest {
    targetIds: string[];
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IUpdateUserRequest {
    newValues: Partial<IUser>;
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

export interface IActivateUserRequest {
    activationCode: string;
}

export interface IChangeAvatarUserRequest {
    filename?: string;
    base64url?: string;
}

export interface IChangePasswordUserRequest {
    oldPassord: string;
    newPassword: string;
}

export interface IChangeExtraStatusUserRequest {
    extraStatus: ExtraStatusType;
}

export interface IVerifyAccessCodeUserReuqest {
    accessCode: string;
}