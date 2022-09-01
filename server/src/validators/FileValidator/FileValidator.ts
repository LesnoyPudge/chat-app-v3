import { IReadAttacmentFileRequest, IReadAvatarFileRequest, IReadRoleImageFileRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isFileExistById, isImChannelMemberByRoleId, isImHasAccessToRoomByMessageId, isMessageExistById, isMongoId, isntMessageDeletedById, isRoleExistById, notEmpty, sanitizeInput, toString } from '../validationChains';



interface IFileValidators {
    readAvatar: ObjectToValidatorsChain<IReadAvatarFileRequest>;
    readAttachment: ObjectToValidatorsChain<IReadAttacmentFileRequest>;
    getAttachmentInfo: ObjectToValidatorsChain<IReadAttacmentFileRequest>;
    readRoleImage: ObjectToValidatorsChain<IReadRoleImageFileRequest>;
}

const attachmentValidators: IFileValidators = {
    readAvatar: {
        avatarId: [
            sanitizeInput({ fieldName: 'avatarId' }),
            notEmpty({ fieldName: 'avatarId' }),
            toString({ fieldName: 'avatarId' }),
            isMongoId({ fieldName: 'avatarId' }),
            isFileExistById({ fieldName: 'avatarId' }),
        ],
    },

    readAttachment: {
        attachmentId: [
            sanitizeInput({ fieldName: 'attachmentId' }),
            notEmpty({ fieldName: 'attachmentId' }),
            toString({ fieldName: 'attachmentId' }),
            isMongoId({ fieldName: 'attachmentId' }),
            isFileExistById({ fieldName: 'attachmentId' }),
        ],

        messageId: [
            sanitizeInput({ fieldName: 'attachmentId' }),
            notEmpty({ fieldName: 'attachmentId' }),
            toString({ fieldName: 'attachmentId' }),
            isMongoId({ fieldName: 'attachmentId' }),
            isMessageExistById({ fieldName: 'attachmentId' }),
            isntMessageDeletedById({ fieldName: 'attachmentId' }),
            isImHasAccessToRoomByMessageId({ fieldName: 'attachmentId' }),
        ],
    },
    
    getAttachmentInfo: {
        attachmentId: [
            sanitizeInput({ fieldName: 'attachmentId' }),
            notEmpty({ fieldName: 'attachmentId' }),
            toString({ fieldName: 'attachmentId' }),
            isMongoId({ fieldName: 'attachmentId' }),
            isFileExistById({ fieldName: 'attachmentId' }),
        ],

        messageId: [
            sanitizeInput({ fieldName: 'attachmentId' }),
            notEmpty({ fieldName: 'attachmentId' }),
            toString({ fieldName: 'attachmentId' }),
            isMongoId({ fieldName: 'attachmentId' }),
            isMessageExistById({ fieldName: 'attachmentId' }),
            isntMessageDeletedById({ fieldName: 'attachmentId' }),
            isImHasAccessToRoomByMessageId({ fieldName: 'attachmentId' }),
        ],
    },

    readRoleImage: {
        imageId: [
            sanitizeInput({ fieldName: 'imageId' }),
            notEmpty({ fieldName: 'imageId' }),
            toString({ fieldName: 'imageId' }),
            isMongoId({ fieldName: 'imageId' }),
            isFileExistById({ fieldName: 'imageId' }),
        ],

        roleId: [
            sanitizeInput({ fieldName: 'roleId' }),
            notEmpty({ fieldName: 'roleId' }),
            toString({ fieldName: 'roleId' }),
            isMongoId({ fieldName: 'roleId' }),
            isRoleExistById({ fieldName: 'roleId' }),
            isImChannelMemberByRoleId({ fieldName: 'roleId' }),
        ],
    },
};

export const FileValidator = createValidator(attachmentValidators);