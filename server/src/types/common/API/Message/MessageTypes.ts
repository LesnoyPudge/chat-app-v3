


export interface IMessage {
    id: string;
    chat: string;
    user: string;
    content: string;
    attachedImages: string[];
    isChanged: boolean;
    isDeleted: boolean;
    respondOn: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ICreateMessageRequest {
    chatId: string;
    content?: string;
    attachedImages?: string[];
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