


export interface IMessage {
    id: string;
    chat: string;
    user: string;
    content: string;
    attachments: string[];
    isChanged: boolean;
    isDeleted: boolean;
    respondOn: string[];
    createdAt: number;
    updatedAt: number;
}

export interface ICreateMessageRequest {
    chatId: string;
    content?: string;
    attachments?: {
        filename: string;
        base64url: string;
    }[];
    respondOn?: string;
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
    content: string;
}

export interface IRestoreMessageRequest {
    messageId: string;
}

export interface IDeleteAttachmentMessageRequest {
    messageId: string;
    attachmentId: string;
}