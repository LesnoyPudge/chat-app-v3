


export interface IChannel {
    id: string;
    identifier: string;
    avatar: string;
    name: string;
    owner: string;
    isPrivate: boolean;
    members: string[];
    rooms: string[];
    roles: string[];
    banList: {
        user: string;
        reason: string;
    }[];
    invitations: {
        creator: string;
        code: string;
        expiryDate: string;
        createdAt: string;
    }[];
    categories: {
        id: string;
        name: string;
    }[],
    createdAt: string;
    updatedAt: string;
}

export interface ICreateChannelRequest {
    name: string;
    identifier: string;
}

export interface IGetOneChannelRequest {
    channelId: string;
}

export interface IGetManyChannelsRequest {
    channelIds: string[];
}

export interface IUpdateChannelRequest {
    channelId: string;
    avatar?: {
        filename: string;
        base64url: string;
    };
    name?: string;
}

export interface IDeleteChannelRequest {
    channelId: string;
}

export interface ILeaveChannelRequest {
    channelId: string;
}

export interface IKickUserChannelRequest {
    channelId: string;
    targetId: string;
}

export interface IBanUserChannelRequest {
    channelId: string;
    targetId: string;
    reason?: string;
}

export interface IUnbanUserChannelRequest {
    channelId: string;
    targetId: string;
}

export interface ICreateInvitationChannelRequest {
    channelId: string;
    code?: string;
    duration: number;
}

export interface IAcceptInvitationChannelRequest {
    channelId: string;
    code: string;
}

export interface IDeleteInvitationChannelRequest {
    channelId: string;
    code: string;
}