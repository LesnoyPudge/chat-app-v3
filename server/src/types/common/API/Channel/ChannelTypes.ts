


export interface IChannel {
    id: string;
    identifier: string;
    avatar: string;
    name: string;
    owner: string;
    isPrivate: boolean;
    invitations: string[];
    members: string[];
    textRooms: string[];
    roles: string[];
    banList: {
        user: string;
        reason: string;
    }[];
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
    channelIds: string[]
}

export interface IUpdateChannelRequest {
    channelId: string,
    newValues: Partial<IChannel>,
}

export interface IDeleteChannelRequest {
    channelId: string;
}




