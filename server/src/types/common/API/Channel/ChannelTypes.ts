


export interface IChannel {
    id: string;
    identifier: string;
    avatar: string;
    name: string;
    owner: string;
    isPrivate: boolean;
    invitations: string[];
    members: string[];
    rooms: string[];
    roles: {
        users: string[];
        role: string;
    }[];
    banList: {
        user: string;
        reason: string;
    }[];
}

export interface ICreateChannelRequest {
    name: string;
    identifier: string;
}

export interface IGetOneChannelRequest {
    channelId: string;
}

export interface IGetMenyChannelsRequest {
    channelIds: string[]
}

export interface IUpdateChannelRequest {
    channelId: string,
    newValues: IChannel,
}

export interface IDeleteChannelRequest {
    channelId: string;
}




