


export interface IPrivateChannel {
    id: string;
    members: string[];
    activeMembers: string[];
    chat: {
        id: string;
        messages: string[]
    };
    createdAt: string;
    updatedAt: string;
}

export interface ICreatePrivateChannelRequest {
    targetId: string;
}

export interface ILeavePrivateChannelRequest {
    privateChannelId: string;
}

export interface IGetOnePrivateChannelRequest {
    privateChannelId: string;    
}

export interface IGetManyPrivateChannelsRequest {
    privateChannelIds: string;
}

export interface IUpdatePrivateChannelRequest {
    privateChannelId: string;
    newValues: Partial<IPrivateChannel>;
}