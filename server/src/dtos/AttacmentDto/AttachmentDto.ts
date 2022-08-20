import { IAttachment } from '@types';
import { IAttachmentModel } from '@models';



interface IAttachmentDto {
    objectFromModel: (attachment: IAttachmentModel) => IAttachment;
}

export const AttachmentDto: IAttachmentDto = {
    objectFromModel(attachment) {
        return {
            id: attachment._id.toString(),
            type: attachment.type,
            filename: attachment.filename,
            size: attachment.size,
            extension: attachment.extension,
            base64string: attachment.base64string,
            createdAt: attachment.createdAt.toString(),
            updatedAt: attachment.updatedAt.toString(),
        };
    },
};