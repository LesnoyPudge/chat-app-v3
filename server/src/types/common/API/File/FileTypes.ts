


export interface IFile {
    id: string;
    filename: string;
    base64url: string;
    createdAt: string;
    updatedAt: string;
}

export interface IReadAttacmentFileRequest {
    messageId: string;
    attachmentId: string;
}

export interface IReadAvatarFileRequest {
    avatarId: string;
}

export interface IReadRoleImageFileRequest {
    roleId: string;
    imageId: string;
}

export interface IDownloadAttacmentFileRequest {
    messageId: string;
    attachmentId: string;
}

export interface IDownloadAvatarFileRequest {
    targetId: string;
    avatarId: string;
}

export interface IDownloadRoleImageFileRequest {
    channelId: string;
    roleId: string;
    imageId: string;
}