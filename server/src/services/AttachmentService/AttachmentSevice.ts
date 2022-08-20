import { AttachmentDto } from '@dtos';
import { AttachmentModel } from '@models';
import { IAttachment, IGetOneAttacmentRequest, ServiceType } from '@types';
import { ApiError } from '@utils';



interface IAttacmentService {
    getOne: ServiceType<IGetOneAttacmentRequest, IAttachment>;
}

export const AttachmentService: IAttacmentService = {
    async getOne({ attachmentId }) {
        const attachment = await AttachmentModel.findById(attachmentId, {}, { lean: true });
        if (!attachment) {
            throw ApiError.badRequest('Не удалось найти файл');
        }

        return AttachmentDto.objectFromModel(attachment);
    },
};