import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type MessageVEndpointsSchema = {
    [Endpoints.V1.Message.Create.ActionName]: Prettify<
        Endpoints.V1.Message.Create.RequestBody
    >,
    [Endpoints.V1.Message.Delete.ActionName]: Prettify<
        Endpoints.V1.Message.Delete.RequestBody
    >,
    [Endpoints.V1.Message.DeleteAttachment.ActionName]: Prettify<
        Endpoints.V1.Message.DeleteAttachment.RequestBody
    >,
    [Endpoints.V1.Message.GetOne.ActionName]: Prettify<
        Endpoints.V1.Message.GetOne.RequestBody
    >,
    [Endpoints.V1.Message.Restore.ActionName]: Prettify<
        Endpoints.V1.Message.Restore.RequestBody
    >,
    [Endpoints.V1.Message.Update.ActionName]: Prettify<
        Endpoints.V1.Message.Update.RequestBody
    >,
}

const { body } = extendedValidator;

export const MessageValidator = createValidator<MessageVEndpointsSchema>({
    create: (req) => ({
        content: (
            body('content')
                .exists()
                .isString()
                ._sanitize()
        ),
        chatId: (
            body('chatId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.ableToCreateMessage(
                    req.auth.id,
                    req.body.chatId,
                ))
        ),
        attachments: [
            body('attachments')
                .exists()
                .isArray()
                .if(body('attachments').isArray({ min: 1 })),
        
            body('attachments.*')
                .if(body('').isArray({ min: 1 }))
                .isObject({ strict: true }),

            ...chainPresets.validEncodedFile('attachments.*', true),    
        ],
    }),

    delete: (req) => ({
        messageId: (
            body('messageId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._messageExistById()
                .custom(customChains.ableToDeleteMessage(
                    req.auth.id,
                    req.body.messageId,
                ))
        ),
    }),

    deleteAttachment: (req) => ({
        fileId: (
            body('fileId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._fileExistsById()
        ),
        messageId: (
            body('messageId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._messageExistById()
                .custom(customChains.attachmentExists(
                    req.body.fileId,
                    req.body.messageId,
                ))
                .custom(customChains.ableToModifyMessage(
                    req.auth.id,
                    req.body.messageId,
                ))
        ),
    }),

    getOne: (req) => ({
        messageId: (
            body('messageId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._messageExistById()
                .custom(customChains.ableToReadMessage(
                    req.auth.id,
                    req.body.messageId,
                ))
        ),
    }),

    restore: (req) => ({
        messageId: (
            body('messageId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._messageExistById()
                .custom(customChains.ableToModifyMessage(
                    req.auth.id,
                    req.body.messageId,
                ))
        ),
    }),

    update: (req) => ({
        content: (
            body('content')
                .exists()
                .isString()
                ._sanitize()
        ),
        messageId: (
            body('messageId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._messageExistById()
                .custom(customChains.ableToModifyMessage(
                    req.auth.id,
                    req.body.messageId,
                ))
        ),
    }),
});