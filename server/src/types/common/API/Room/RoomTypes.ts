


export interface IRoom {
    id: string;
    name: string;
    channel: string;
    chat: string;
    whiteList: {
        users: string[];
        roles: string[];
    };
    type: 'voice' | 'text';
    category: string;
    createdAt: string;
    updatedAt: string;
}


export interface ICreateRoomRequest {
    name: string;
    channelId: string;
}

export interface IGetOneRoomRequest {
    channelId: string;
    roomId: string;
}

export interface IUpdateRoomRequest {
    channelId: string;
    roomId: string;
    name: string;
    category: string;
}

export interface IDeleteRoomRequest {
    channelId: string;
    roomId: string;
}