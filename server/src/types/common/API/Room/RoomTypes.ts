


export interface IRoom {
    id: string;
    name: string;
    identifier: string;
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
    identifier: string;
    channelId: string;
}

export interface IGetOneRoomRequest {
    roomId: string;
}

export interface IGetManyRoomsRequest {
    roomIds: string[]
}

export interface IUpdateRoomRequest {
    roomId: string,
    newValues: Partial<IRoom>,
}

export interface IDeleteRoomRequest {
    roomId: string;
}