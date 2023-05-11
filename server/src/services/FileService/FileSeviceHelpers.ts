import { FileDto } from '@dtos';
import { FileModel } from '@models';
import { getRandomNumber, transactionContainer } from '@utils';
import { defaultAvatars } from '@assets';



export const FileServiceHelpers = {
    async create(
        { filename, base64url, type }: 
        { filename: string, base64url: string, type: 'avatar' | 'attachment' | 'roleImage'},
    ) {
        return transactionContainer(
            async({ queryOptions }) => {
                const attachment = await FileModel.create(
                    [{
                        type,
                        filename,
                        base64url,
                    }],
                    queryOptions(),
                ).then((attachments) => attachments[0]);
                
                return attachment;
            },
        );
    },
    
    async getOne({ attachmentId }: {attachmentId: string}) {
        const attachment = await FileModel.findById(attachmentId, {}, { lean: true });
        
        return FileDto.objectFromModel(attachment);
    },

    async getMany({ attachmentIds }: {attachmentIds: string[]}) {
        const attachments = await FileModel.find({ _id: { $in: attachmentIds } }, {}, { lean: true });
        
        return attachments.map((attachment) => {
            return FileDto.objectFromModel(attachment);
        });
    },

    async getDefaultUserAvatar() {
        return transactionContainer(
            async({ queryOptions }) => {
                const randomIndex = getRandomNumber({ min: 0, max: defaultAvatars });
                const { filename, base64url } = defaultAvatars[randomIndex];

                const attachment = await FileModel.findOne(
                    { filename, base64url, isDefault: true }, 
                    {}, 
                    { lean: true },
                );
                if (attachment) return FileDto.objectFromModel(attachment);

                const newAttacment = await FileModel.create(
                    [{
                        isDefault: true,
                        filename,
                        base64url,
                        type: 'avatar',
                    }],
                    queryOptions(),
                ).then((attachments) => attachments[0]);

                return newAttacment;
            },
        );
    },

    async delete({ attachmentId }: {attachmentId: string}) {
        return transactionContainer(
            async({ queryOptions }) => {
                const attachmentToDelete = await FileModel.findById(attachmentId);
                if (!attachmentToDelete) return;
                if (attachmentToDelete.isDefault) return;

                await attachmentToDelete.delete(queryOptions());
            },
        );
    },

    async isFileExistById({ fileId }: {fileId: string}) {
        const isExist = !!await FileModel.exists({ _id: fileId });
        return isExist;
    },
};