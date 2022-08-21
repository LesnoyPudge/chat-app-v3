import { AttachmentService } from '@services';
import { ControllerType, IReadAttacmentRequest } from '@types';
import { base64 } from '@utils';




interface IAttachmentController {
    read: ControllerType<void, IReadAttacmentRequest, Buffer>;
}

export const AttachmentController: IAttachmentController = {
    async read(req, res) {
        const { attachmentId } = req.params;
    
        const attachment = await AttachmentService.read({ attachmentId });

        const { base64String, type } = base64.getUrlComponents(attachment.base64url);
        const file = Buffer.from(base64String, 'base64');
        
        const isImage = type.split('/')[0] === 'image';
        if (!isImage) res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);

        res.setHeader('Content-Type', type).send(file);
    },
};