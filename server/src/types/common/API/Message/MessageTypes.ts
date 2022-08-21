


export interface IMessage {
    id: string;
    chat: string;
    user: string;
    content: string;
    atttachments: string[];
    isChanged: boolean;
    isDeleted: boolean;
    respondOn: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ICreateMessageRequest {
    chatId: string;
    content?: string;
    atttachments?: string[];
    respondOn?: string[];
}

export interface IDeleteMessageRequest {
    messageId: string;
}

export interface IGetOneMessageRequest {
    messageId: string;    
}

export interface IGetManyMessagesRequest {
    messageIds: string;
}

export interface IUpdateMessageRequest {
    messageId: string;
    newValues: Partial<IMessage>;
}

export interface IRestoreMessageRequest {
    messageId: string;
}