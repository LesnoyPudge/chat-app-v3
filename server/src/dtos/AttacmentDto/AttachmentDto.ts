import { IAttachment } from '@types';
import { IAttachmentModel } from '@models';



interface IAttachmentDto {
    objectFromModel: (attachment: IAttachmentModel) => IAttachment;
}

export const AttachmentDto: IAttachmentDto = {
    objectFromModel(attachment) {
        return {
            id: attachment._id.toString(),
            filename: attachment.filename,
            base64url: attachment.base64url,
            createdAt: attachment.createdAt.toString(),
            updatedAt: attachment.updatedAt.toString(),
        };
    },
};