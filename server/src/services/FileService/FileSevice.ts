import { FileDto } from '@dtos';
import { FileModel } from '@models';
import { AuthorizedServiceType, IFile, IReadAttacmentFileRequest, IReadAvatarFileRequest, IReadRoleImageFileRequest } from '@types';



interface IFileService {
    readAvatar: AuthorizedServiceType<IReadAvatarFileRequest, IFile>;
    readAttachment: AuthorizedServiceType<IReadAttacmentFileRequest, IFile>;
    readRoleImage: AuthorizedServiceType<IReadRoleImageFileRequest, IFile>;
}

export const FileService: IFileService = {
    async readAvatar({ avatarId }) {
        const avatar = await FileModel.findOne({ _id: avatarId, type: 'avatar' }, {}, { lean: true });
        return FileDto.objectFromModel(avatar);
    },

    async readAttachment({ attachmentId }) {
        const attachment = await FileModel.findOne({ _id: attachmentId, type: 'attachment' }, {}, { lean: true });
        return FileDto.objectFromModel(attachment);
    },

    async readRoleImage({ imageId }) {
        const attachment = await FileModel.findOne({ _id: imageId, type: 'roleImage' }, {}, { lean: true });
        return FileDto.objectFromModel(attachment);
    },
};