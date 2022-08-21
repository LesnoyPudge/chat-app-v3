


export interface IAttachment {
    id: string;
    filename: string;
    base64url: string;
    createdAt: string;
    updatedAt: string;
}

export interface IReadAttacmentRequest {
    attachmentId: string;
}