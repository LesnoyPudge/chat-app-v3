import { AttachmentDto } from '@dtos';
import { AttachmentModel } from '@models';
import { IAttachment, IGetOneAttacmentRequest, ServiceType } from '@types';
import { ApiError, transactionContainer } from '@utils';



export const AttachmentService = {
    async create({ 
        type, 
        filename, 
        size, 
        base64string, 
    }: {
        type?: string, 
        filename?: string, 
        size?: number, 
        base64string: string
    }) {
        return transactionContainer(
            async({ queryOptions }) => {
                const hasMisssingAtributes = !type || !filename || !size;
                if (hasMisssingAtributes) {
                    // 
                }

                const attachment = await AttachmentModel.create(
                    [{
                        type,
                        filename,
                        size,
                        base64string,
                    }],
                    queryOptions(),
                ).then((attachments) => attachments[0]);
                
                return AttachmentDto.objectFromModel(attachment);
            },
        );
    },
    
    async getOne({ attachmentId }: {attachmentId: string}) {
        const attachment = await AttachmentModel.findById(attachmentId, {}, { lean: true });
        
        return AttachmentDto.objectFromModel(attachment);
    },

    async getMany({ attachmentIds }: {attachmentIds: string[]}) {
        const attachments = await AttachmentModel.find({ _id: { $in: attachmentIds } }, {}, { lean: true });
        
        return attachments.map((attachment) => {
            return AttachmentDto.objectFromModel(attachment);
        });
    },
};