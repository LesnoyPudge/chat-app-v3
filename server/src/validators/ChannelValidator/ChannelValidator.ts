import { ICreateChannelRequest, IGetOneChannelRequest, IGetManyChannelsRequest, IUpdateChannelRequest, IDeleteChannelRequest, ILeaveChannelRequest, IKickUserChannelRequest, IBanUserChannelRequest, IUnbanUserChannelRequest, ICreateInvitationChannelRequest, IAcceptInvitationChannelRequest, IDeleteInvitationChannelRequest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { isArray, isBase64Url, isChannelExistById, isChannelIdentifierUnoccupied, isChannelsExistsById, isImChannelAdministrator, isImChannelMember, isImChannelOwner, isImChannelsMember, isImInvitationCreator, isInvitationCodeUnoccupied, isMongoId, isntImChannelMember, isntUserChannelOwner, isPermittedToBanMember, isPermittedToChangeChannel, isPermittedToCreateInvitaion, isPermittedToKickMember, isUserChannelMember, isUserExistById, isUserInChannelBanList, isValidInvitationCode, notEmpty, nullable, reject, sanitizeInput, toInt, toString } from '../validationChains';



interface IChannelValidators {
    create: ObjectToValidatorsChain<ICreateChannelRequest>;
    getOne: ObjectToValidatorsChain<IGetOneChannelRequest>;
    // getMany: ObjectToValidatorsChain<IGetManyChannelsRequest>;
    update: ObjectToValidatorsChain<IUpdateChannelRequest>;
    delete: ObjectToValidatorsChain<IDeleteChannelRequest>;
    leave: ObjectToValidatorsChain<ILeaveChannelRequest>;
    kickUser: ObjectToValidatorsChain<IKickUserChannelRequest>;
    banUser: ObjectToValidatorsChain<IBanUserChannelRequest>;
    unbanUser: ObjectToValidatorsChain<IUnbanUserChannelRequest>;
    createInvitation: ObjectToValidatorsChain<ICreateInvitationChannelRequest>;
    acceptInvitation: ObjectToValidatorsChain<IAcceptInvitationChannelRequest>;
    deleteInvitation: ObjectToValidatorsChain<IDeleteInvitationChannelRequest>;
}

const channelValidators: IChannelValidators = {
    create: {
        identifier: [
            sanitizeInput({ fieldName: 'identifier' }),
            notEmpty({ fieldName: 'identifier' }),
            toString({ fieldName: 'identifier' }),
            isChannelIdentifierUnoccupied({ fieldName: 'identifier' }),
        ],

        name: [
            sanitizeInput({ fieldName: 'name' }),
            notEmpty({ fieldName: 'name' }),
            toString({ fieldName: 'name' }),
        ],
    },
    
    getOne: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelMember({ fieldName: 'channelId' }),
        ],
    },
    
    // getMany: {
    //     channelIds: [
    //         isArray({ fieldName: 'channelIds' }),
    //         notEmpty({ fieldName: 'channelIds' }),
    //         sanitizeInput({ fieldName: 'channelIds.*' }),
    //         toString({ fieldName: 'channelIds.*' }),
    //         notEmpty({ fieldName: 'channelIds.*' }),
    //         isMongoId({ fieldName: 'channelIds.*' }),
    //         isChannelsExistsById({ fieldName: 'channelIds' }),
    //         isImChannelsMember({ fieldName: 'channelIds' }),
    //     ],
    // },
    
    update: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            isPermittedToChangeChannel({ fieldName: 'channelId' }),
        ],

        avatar: [
            nullable({ fieldName: 'avatar' }),
            nullable({ fieldName: 'avatar.filename' }),
            nullable({ fieldName: 'avatar.base64url' }),

            sanitizeInput({ fieldName: 'avatar' }),
            sanitizeInput({ fieldName: 'avatar.filename' }),
            sanitizeInput({ fieldName: 'avatar.base64url' }),

            notEmpty({ fieldName: 'avatar' }),
            notEmpty({ fieldName: 'avatar.filename' }),
            notEmpty({ fieldName: 'avatar.base64url' }),

            toString({ fieldName: 'avatar.filename' }),
            toString({ fieldName: 'avatar.base64url' }),

            isBase64Url({ fieldName:  'avatar.base64url' }),
        ],

        name: [
            nullable({ fieldName: 'avatar' }),
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
        ],
    },
    
    delete: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ fieldName: 'channelId', errorMessage: 'Отсутствует разрешение на удаление канала' }),
        ],
    },
    
    leave: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelMember({ fieldName: 'channelId' }),
        ],
    },
    
    kickUser: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            isPermittedToKickMember({ fieldName: 'channelId' }),
        ],

        targetId: [
            sanitizeInput({ fieldName: 'targetId' }),
            notEmpty({ fieldName: 'targetId' }),
            toString({ fieldName: 'targetId' }),
            isMongoId({ fieldName: 'targetId' }),
            isUserExistById({ fieldName: 'targetId' }),
            isUserChannelMember({ fieldName: 'targetId', extraFields: { channelIdPath: 'body.channelId' } }),
            isntUserChannelOwner({ fieldName: 'targetId', extraFields: { channelIdPath: 'body.channelId' } }),
        ],
    },
    
    banUser: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            isPermittedToBanMember({ fieldName: 'channelId' }),
        ],

        reason: [
            nullable({ fieldName: 'reason' }),
            sanitizeInput({ fieldName: 'reason' }),
            notEmpty({ fieldName: 'reason' }),
            toString({ fieldName: 'resaon' }),
        ],
        
        targetId: [
            sanitizeInput({ fieldName: 'targetId' }),
            notEmpty({ fieldName: 'targetId' }),
            toString({ fieldName: 'targetId' }),
            isMongoId({ fieldName: 'targetId' }),
            isUserExistById({ fieldName: 'targetId' }),
            isntUserChannelOwner({ fieldName: 'targetId' }),
            isUserChannelMember({ fieldName: 'targetId' }),
        ],
    },
    
    unbanUser: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            isPermittedToBanMember({ fieldName: 'channelId' }),
        ],

        targetId: [
            sanitizeInput({ fieldName: 'targetId' }),
            notEmpty({ fieldName: 'targetId' }),
            toString({ fieldName: 'targetId' }),
            isMongoId({ fieldName: 'targetId' }),
            isUserExistById({ fieldName: 'targetId' }),
            isUserInChannelBanList({ fieldName: 'targetId', extraFields: { channelIdPath: 'body.channelId' } }),
        ],
    },
    
    createInvitation: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            isPermittedToCreateInvitaion({ fieldName: 'channelId' }),
        ],
        
        code: [
            nullable({ fieldName: 'code' }),
            sanitizeInput({ fieldName: 'code' }),
            notEmpty({ fieldName: 'code' }),
            toString({ fieldName: 'code' }),
            isInvitationCodeUnoccupied({ fieldName: 'code', extraFields: { channelIdPath: 'body.channelId' } }),
        ],

        duration: [
            sanitizeInput({ fieldName: 'duration' }),
            notEmpty({ fieldName: 'duration' }),
            toInt({ fieldName: 'duration' }),
        ],
    },
    
    acceptInvitation: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isntImChannelMember({ fieldName: 'channelId' }),
        ],

        code: [
            sanitizeInput({ fieldName: 'code' }),
            notEmpty({ fieldName: 'code' }),
            toString({ fieldName: 'code' }),
            isValidInvitationCode({ fieldName: 'code', extraFields: { channelIdPath: 'body.channelId' } }),
        ],
    },
    
    deleteInvitation: {
        channelId: [
            sanitizeInput({ fieldName: 'channelId' }),
            notEmpty({ fieldName: 'channelId' }),
            toString({ fieldName: 'channelId' }),
            isMongoId({ fieldName: 'channelId' }),
            isChannelExistById({ fieldName: 'channelId' }),
            isImInvitationCreator({ fieldName: 'channelId', extraFields: { invitationCodePath: 'body.code' } }),
            isImChannelAdministrator({ fieldName: 'channelId' }),
            isImChannelOwner({ fieldName: 'channelId' }),
            reject({ 
                fieldName: 'channelId', 
                errorMessage: 'Неверно указан код или отсутствует разрешение на его удаление', 
            }),
        ],
        
        code: [
            sanitizeInput({ fieldName: 'code' }),
            notEmpty({ fieldName: 'code' }),
            toString({ fieldName: 'code' }),
        ],
    },
};

export const ChannelValidator = createValidator(channelValidators);