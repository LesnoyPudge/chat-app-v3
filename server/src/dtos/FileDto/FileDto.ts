import { IFile } from '@types';
import { IFileModel } from '@models';



interface IFileDto {
    objectFromModel: (file: IFileModel) => IFile;
}

export const FileDto: IFileDto = {
    objectFromModel(file) {
        return {
            id: file._id.toString(),
            filename: file.filename,
            base64url: file.base64url,
            createdAt: file.createdAt.toString(),
            updatedAt: file.updatedAt.toString(),
        };
    },
};