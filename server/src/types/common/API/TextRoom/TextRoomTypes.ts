


export interface ITextRoom {
    id: string;
    name: string;
    identifier: string;
    channel: string;
    chat: string;
    whiteList: {
        users: string[];
        roles: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}


export interface ICreateTextRoomRequest {
    name: string;
    identifier: string;
    channelId: string;
}

export interface IGetOneTextRoomRequest {
    textRoomId: string;
}

export interface IGetMenyTextRoomsRequest {
    textRoomIds: string[]
}

export interface IUpdateTextRoomRequest {
    textRoomId: string,
    newValues: ITextRoom | any,
}

export interface IDeleteTextRoomRequest {
    textRoomId: string;
}