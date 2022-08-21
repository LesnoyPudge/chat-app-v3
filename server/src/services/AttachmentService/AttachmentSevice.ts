import { AttachmentDto } from '@dtos';
import { AttachmentModel } from '@models';
import { IAttachment, IReadAttacmentRequest, ServiceType } from '@types';
import { ApiError } from '@utils';



interface IAttacmentService {
    read: ServiceType<IReadAttacmentRequest, IAttachment>;
}

export const AttachmentService: IAttacmentService = {
    async read({ attachmentId }) {
        const attachment = await AttachmentModel.findById(attachmentId, {}, { lean: true });
        if (!attachment) {
            throw ApiError.badRequest('Не удалось найти файл');
        }
        
        return AttachmentDto.objectFromModel(attachment);
    },
};