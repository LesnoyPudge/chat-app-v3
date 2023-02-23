import { ICreateMessageRequest, IGetOneMessageRequest, IUpdateMessageRequest, IDeleteMessageRequest, IRestoreMessageRequest, IDeleteAttachmentMessageRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isBase64Url, isFileExistById, isImMessageOwner, isMessageDeletedById, isMessageExistById, isMongoId, isntMessageDeletedById, isPermittedToSendMessageByChatId, isPrivateChannelByChatId, notEmpty, nullable, sanitizeInput, toString } from '../validationChains';



interface IMessageValidators {
    create: ObjectToValidatorsChain<ICreateMessageRequest>;
    getOne: ObjectToValidatorsChain<IGetOneMessageRequest>;
    update: ObjectToValidatorsChain<IUpdateMessageRequest>;
    delete: ObjectToValidatorsChain<IDeleteMessageRequest>;
    restore: ObjectToValidatorsChain<IRestoreMessageRequest>;
    deleteAttachment: ObjectToValidatorsChain<IDeleteAttachmentMessageRequest>;
}

const messageValidators: IMessageValidators = {
    create: {
        chatId: [
            sanitizeInput({ fieldName: 'chatId' }),
            notEmpty({ fieldName: 'chatId' }),
            toString({ fieldName: 'chatId' }),
            isMongoId({ fieldName: 'chatId' }),
            isPrivateChannelByChatId({ fieldName: 'chatId' }),
            isPermittedToSendMessageByChatId({ fieldName: 'chatId' }),
        ],

        attachments: [
            nullable({ fieldName: 'attachments' }),
            sanitizeInput({ fieldName: 'attachments' }),
            notEmpty({ fieldName: 'attachments' }),

            sanitizeInput({ fieldName: 'attachments.*' }),
            notEmpty({ fieldName: 'attachments.*' }),

            sanitizeInput({ fieldName: 'attachments.*.*' }),
            notEmpty({ fieldName: 'attachments.*.*' }),
            toString({ fieldName: 'attachments.*.*' }),

            isBase64Url({ fieldName: 'attachments.*.base64url' }),
        ],

        content: [
            nullable({ fieldName: 'content' }),
            sanitizeInput({ fieldName: 'content' }),
            notEmpty({ fieldName: 'content' }),
            toString({ fieldName: 'content' }),
        ],

        respondOn: [
            nullable({ fieldName: 'respondOn' }),
            sanitizeInput({ fieldName: 'respondOn' }),
            notEmpty({ fieldName: 'respondOn' }),
            toString({ fieldName: 'respondOn' }),
            isMongoId({ fieldName: 'respondOn' }),
            isMessageExistById({ fieldName: 'respondOn' }),
            isntMessageDeletedById({ fieldName: 'respondOn' }),
        ],
    },

    getOne: {
        messageId: [
            sanitizeInput({ fieldName: 'messageId' }),
            notEmpty({ fieldName: 'messageId' }),
            toString({ fieldName: 'messageId' }),
            isMongoId({ fieldName: 'messageId' }),
            isMessageExistById({ fieldName: 'messageId' }),
        ],
    },

    update: {
        messageId: [
            sanitizeInput({ fieldName: 'messageId' }),
            notEmpty({ fieldName: 'messageId' }),
            toString({ fieldName: 'messageId' }),
            isMongoId({ fieldName: 'messageId' }),
            isMessageExistById({ fieldName: 'messageId' }),
            isntMessageDeletedById({ fieldName: 'messageId' }),
            isImMessageOwner({ fieldName: 'messageId' }),
        ],

        content: [
            nullable({ fieldName: 'messageId' }),
            sanitizeInput({ fieldName: 'messageId' }),
            notEmpty({ fieldName: 'messageId' }),
            toString({ fieldName: 'messageId' }),
        ],
    },

    delete: {
        messageId: [
            sanitizeInput({ fieldName: 'messageId' }),
            notEmpty({ fieldName: 'messageId' }),
            toString({ fieldName: 'messageId' }),
            isMongoId({ fieldName: 'messageId' }),
            isMessageExistById({ fieldName: 'messageId' }),
            isntMessageDeletedById({ fieldName: 'messageId' }),
            isImMessageOwner({ fieldName: 'messageId' }),
        ],
    },

    restore: {
        messageId: [
            sanitizeInput({ fieldName: 'messageId' }),
            notEmpty({ fieldName: 'messageId' }),
            toString({ fieldName: 'messageId' }),
            isMongoId({ fieldName: 'messageId' }),
            isMessageExistById({ fieldName: 'messageId' }),
            isMessageDeletedById({ fieldName: 'messageId' }),
            isImMessageOwner({ fieldName: 'messageId' }),
        ],
    },

    deleteAttachment: {
        messageId: [
            sanitizeInput({ fieldName: 'messageId' }),
            notEmpty({ fieldName: 'messageId' }),
            toString({ fieldName: 'messageId' }),
            isMongoId({ fieldName: 'messageId' }),
            isMessageExistById({ fieldName: 'messageId' }),
            isntMessageDeletedById({ fieldName: 'messageId' }),
            isImMessageOwner({ fieldName: 'messageId' }),
        ],

        attachmentId: [
            sanitizeInput({ fieldName: 'attachmentId' }),
            notEmpty({ fieldName: 'attachmentId' }),
            toString({ fieldName: 'attachmentId' }),
            isMongoId({ fieldName: 'attachmentId' }),
            isFileExistById({ fieldName: 'attachmentId' }),
        ],
    },
};

export const MessageValidator = createValidator(messageValidators);