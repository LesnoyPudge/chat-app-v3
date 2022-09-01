import { FileService } from '@services';
import { AuthorizedControllerType, IFile, IReadAttacmentFileRequest, IReadAvatarFileRequest, IReadRoleImageFileRequest } from '@types';
import { base64 } from '@utils';




interface IFileController {
    readAvatar: AuthorizedControllerType<IReadAvatarFileRequest, never, Buffer>;
    readAttachment: AuthorizedControllerType<IReadAttacmentFileRequest, never, Buffer>;
    getAttachmentInfo: AuthorizedControllerType<IReadAttacmentFileRequest, never, IFile>;
    readRoleImage: AuthorizedControllerType<IReadRoleImageFileRequest, never, Buffer>;
}

export const FileController: IFileController = {
    async readAvatar(req, res) {
        const { avatarId } = req.body;
        const { id } = req.auth.user;
    
        const avatar = await FileService.readAvatar({ avatarId, userId: id });
        const { base64String, type } = base64.getUrlComponents(avatar.base64url);
        const file = Buffer.from(base64String, 'base64');

        res.setHeader('Content-Type', type);
        res.send(file);
    },

    async readAttachment(req, res) {
        const { attachmentId, messageId } = req.body;
        const { id } = req.auth.user;
    
        const attachment = await FileService.readAttachment({ attachmentId, messageId, userId: id });
        const { base64String, type } = base64.getUrlComponents(attachment.base64url);
        const file = Buffer.from(base64String, 'base64');

        const isImage = type.split('/')[0] === 'image';
        if (!isImage) res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
        res.setHeader('Content-Type', type);
        res.send(file);
    },

    async getAttachmentInfo(req, res) {
        const { attachmentId, messageId } = req.body;
        const { id } = req.auth.user;

        const attachment = await FileService.readAttachment({ attachmentId, messageId, userId: id });

        res.json(attachment);
    },

    async readRoleImage(req, res) {
        const { imageId, roleId } = req.body;
        const { id } = req.auth.user;
    
        const avatar = await FileService.readRoleImage({ imageId, roleId, userId: id });
        const { base64String, type } = base64.getUrlComponents(avatar.base64url);
        const file = Buffer.from(base64String, 'base64');

        res.setHeader('Content-Type', type);
        res.send(file);
    },
};