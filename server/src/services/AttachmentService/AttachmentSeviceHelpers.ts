import { AttachmentDto } from '@dtos';
import { AttachmentModel } from '@models';
import { getRandomNumber, transactionContainer } from '@utils';
import { defaultAvatars } from '@assets';



export const AttachmentServiceHelpers = {
    async create({ filename, base64url }: { filename: string, base64url: string}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const attachment = await AttachmentModel.create(
                    [{
                        filename,
                        base64url,
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

    async getDefaultUserAvatar() {
        return transactionContainer(
            async({ queryOptions }) => {
                const randomIndex = getRandomNumber({ min: 0, max: defaultAvatars });
                const { identifier, filename, base64url } = defaultAvatars[randomIndex];

                const attachment = await AttachmentModel.findOne({ identifier }, {}, { lean: true });
                if (attachment) return AttachmentDto.objectFromModel(attachment);

                const newAttacment = await AttachmentModel.create(
                    [{
                        identifier,
                        filename,
                        base64url,
                    }],
                    queryOptions(),
                ).then((attachments) => attachments[0]);

                return AttachmentDto.objectFromModel(newAttacment);
            },
        );
    },

    async delete({ attachmentId }: {attachmentId: string}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const attachmentToDelete = await AttachmentModel.findById(attachmentId);
                if (!attachmentToDelete) return;
                if (attachmentToDelete.identifier) return;

                await attachmentToDelete.delete(queryOptions());
            },
        );
    },
};