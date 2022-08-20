


export interface IAttachment {
    id: string;
    type: string;
    filename: string;
    size: number;
    extension: string;
    base64string: string;
    createdAt: string;
    updatedAt: string;
}

export interface IGetOneAttacmentRequest {
    attachmentId: string;
}