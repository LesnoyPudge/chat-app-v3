import { IAcceptFriendRequestUserRequest, IActivateAccountUserRequest, IBlockUserRequest, ICredentialsUpdateUserRequest, IDeclineFriendRequestUserRequest, IDeleteFriendUserRequest, IGetOneUserRequest, ILoginUserRequest, IProfileUpdateUserRequest, IRegistrationUserRequest, IRevokeFriendRequestUserRequest, ISendFriendRequestUserRequest, IUnblockUserRequest, IVerifyAccessCodeUserReuqest } from '@types';
import { check } from 'express-validator';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { nullable, sanitizeInput, notEmpty, isEmail, isEmailUnoccupied, toString, isLoginUnoccupied, isValidLogin, isValidPassword, isMongoId, isUserExistById, isntInMyBlockList, isntInMyFriendList, isInMyBlockList, isntInMyIncomingFriendRequests, isntInMyOutgoingFriendRequests, isInMyIncomingFriendRequests, isntImInBlockList, isInMyOutgoingFriendRequests, isInMyFriendList, isUUID, isBase64Url, isntSameAsOldPassword, isValidAccessCode, toInt } from '../validationChains';



interface IUserValidators {
    registration: ObjectToValidatorsChain<IRegistrationUserRequest>;
    login: ObjectToValidatorsChain<ILoginUserRequest>;
    getOne: ObjectToValidatorsChain<IGetOneUserRequest>;
    update: ObjectToValidatorsChain<IProfileUpdateUserRequest>;
    credentialsUpdate: ObjectToValidatorsChain<ICredentialsUpdateUserRequest>
    blockUser: ObjectToValidatorsChain<IBlockUserRequest>;
    unblockUser: ObjectToValidatorsChain<IUnblockUserRequest>;
    sendFriendRequest: ObjectToValidatorsChain<ISendFriendRequestUserRequest>;
    acceptFriendRequest: ObjectToValidatorsChain<IAcceptFriendRequestUserRequest>;
    declineFriendRequest: ObjectToValidatorsChain<IDeclineFriendRequestUserRequest>;
    revokeFriendRequest: ObjectToValidatorsChain<IRevokeFriendRequestUserRequest>;
    deleteFriend: ObjectToValidatorsChain<IDeleteFriendUserRequest>;
    activateAccount: ObjectToValidatorsChain<IActivateAccountUserRequest>;
    verifyAccessCode: ObjectToValidatorsChain<IVerifyAccessCodeUserReuqest>;
}

const userValidators: IUserValidators = {
    registration: {
        email: [
            nullable({ fieldName:  'email' }),
            sanitizeInput({ fieldName:  'email' }),
            notEmpty({ fieldName:  'email' }),
            toString({ fieldName:  'email' }),
            isEmail({ fieldName:  'email' }),
            isEmailUnoccupied({ fieldName:  'email' }),
        ],
        login: [
            sanitizeInput({ fieldName:  'login' }),
            notEmpty({ fieldName:  'login' }),
            toString({ fieldName:  'login' }),
            isLoginUnoccupied({ fieldName:  'login' }),
        ],
        username: [
            sanitizeInput({ fieldName:  'username' }),
            notEmpty({ fieldName:  'username' }),
            toString({ fieldName:  'username' }),
        ],
        password: [
            sanitizeInput({ fieldName:  'password' }),
            notEmpty({ fieldName:  'password' }),
            toString({ fieldName:  'password' }),
        ],
    },

    login: {
        login: [
            sanitizeInput({ fieldName:  'login' }),
            notEmpty({ fieldName:  'login' }),
            toString({ fieldName:  'login' }),
            isValidLogin({ fieldName:  'login' }),
        ],
        password: [
            sanitizeInput({ fieldName:  'password' }),
            notEmpty({ fieldName:  'password' }),
            toString({ fieldName:  'password' }),
            isValidPassword({ fieldName:  'password' }),
        ],
    },

    getOne: {
        targetId: [
            sanitizeInput({ fieldName:  'targetId' }),
            notEmpty({ fieldName:  'targetId' }),
            toString({ fieldName:  'targetId' }),
            isMongoId({ fieldName:  'targetId' }),
            isUserExistById({ fieldName:  'targetId' }),
        ],
    },

    update: {
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

        extraStatus: [
            nullable({ fieldName: 'extraStatus' }),
            sanitizeInput({ fieldName:  'extraStatus' }),
            notEmpty({ fieldName:  'extraStatus' }),
            toString({ fieldName:  'extraStatus' }),
            check('extraStatus')
                .isIn(['default', 'afk', 'dnd', 'invisible'])
                .withMessage('Статус указан некорректно'),
        ],

        settings: [
            nullable({ fieldName: 'settings' }),
            sanitizeInput({ fieldName:  'settings' }),
            notEmpty({ fieldName:  'settings' }),
            
            nullable({ fieldName: 'settings.theme' }),
            sanitizeInput({ fieldName:  'settings.theme' }),
            notEmpty({ fieldName:  'settings.theme' }),
            toString({ fieldName: 'settings.theme' }),
            check('settings.theme')
                .isIn(['auto', 'dark', 'light'])
                .withMessage('Тема указана некорректно'),

            nullable({ fieldName: 'settings.fontSize' }),
            sanitizeInput({ fieldName:  'settings.fontSize' }),
            notEmpty({ fieldName:  'settings.fontSize' }),
            toInt({ fieldName: 'settings.fontSize' }),
            check('settings.fontSize')
                .isInt({ min:12, max: 20 })
                .withMessage('Размер шрифта указан некорректно'),

            nullable({ fieldName: 'settings.messageGroupSpacing' }),
            sanitizeInput({ fieldName:  'settings.messageGroupSpacing' }),
            notEmpty({ fieldName:  'settings.messageGroupSpacing' }),
            toInt({ fieldName: 'settings.messageGroupSpacing' }),
            check('settings.fontSize')
                .isInt({ min:12, max: 20 })
                .withMessage('Размер отступа указан некорректно'),

            nullable({ fieldName: 'settings.transitionSpeedModifier' }),
            sanitizeInput({ fieldName:  'settings.transitionSpeedModifier' }),
            notEmpty({ fieldName:  'settings.transitionSpeedModifier' }),
            toInt({ fieldName: 'settings.transitionSpeedModifier' }),
            check('settings.transitionSpeedModifier')
                .isInt({ min:0, max: 2 })
                .withMessage('Модификатор указан некорректно'),
        ],

        username: [
            nullable({ fieldName: 'extraStatus' }),
            sanitizeInput({ fieldName:  'extraStatus' }),
            notEmpty({ fieldName:  'extraStatus' }),
            toString({ fieldName:  'extraStatus' }),
        ],
    },

    credentialsUpdate: {
        accessCode: [
            sanitizeInput({ fieldName:  'accessCode' }),
            notEmpty({ fieldName:  'accessCode' }),
            toString({ fieldName:  'accessCode' }),
            isValidAccessCode({ fieldName:  'accessCode' }),
        ],
        
        password: [
            sanitizeInput({ fieldName:  'password' }),
            notEmpty({ fieldName:  'password' }),
            toString({ fieldName:  'password' }),
            isValidPassword({ fieldName:  'password', errorMessage: 'Неверный пароль' }),
        ],

        newEmail: [
            nullable({ fieldName:  'newEmail' }),
            sanitizeInput({ fieldName:  'newEmail' }),
            notEmpty({ fieldName:  'newEmail' }),
            toString({ fieldName:  'newEmail' }),
            isEmail({ fieldName:  'newEmail' }),
            isEmailUnoccupied({ fieldName:  'newEmail' }),
        ],
        
        newLogin: [
            nullable({ fieldName:  'newLogin' }),
            sanitizeInput({ fieldName:  'newLogin' }),
            notEmpty({ fieldName:  'newLogin' }),
            toString({ fieldName:  'newLogin' }),
            isLoginUnoccupied({ fieldName:  'newLogin' }),
        ],
        
        newPassword: [
            nullable({ fieldName:  'newPassword' }),
            sanitizeInput({ fieldName:  'newPassword' }),
            notEmpty({ fieldName:  'newPassword' }),
            toString({ fieldName:  'newPassword' }),
            isntSameAsOldPassword({ fieldName:  'newPassword' }),
        ],
    },

    blockUser: {
        targetId: [
            sanitizeInput({ fieldName:  'targetId' }),
            notEmpty({ fieldName:  'targetId' }),
            toString({ fieldName:  'targetId' }),
            isMongoId({ fieldName:  'targetId' }),
            isUserExistById({ fieldName:  'targetId' }),
            isntInMyBlockList({ fieldName:  'targetId' }),
        ],
    },

    unblockUser: {
        targetId: [
            sanitizeInput({ fieldName:  'targetId' }),
            notEmpty({ fieldName:  'targetId' }),
            toString({ fieldName:  'targetId' }),
            isMongoId({ fieldName:  'targetId' }),
            isUserExistById({ fieldName:  'targetId' }),
            isInMyBlockList({ fieldName:  'targetId' }),
        ],
    },

    sendFriendRequest: {
        to: [
            sanitizeInput({ fieldName:  'to' }),
            notEmpty({ fieldName:  'to' }),
            toString({ fieldName:  'to' }),
            isMongoId({ fieldName:  'to' }),
            isUserExistById({ fieldName:  'to' }),
            isntImInBlockList({ fieldName:  'to' }),
            isntInMyBlockList({ fieldName:  'to' }),
            isntInMyOutgoingFriendRequests({ fieldName:  'to' }),
            isntInMyIncomingFriendRequests({ fieldName:  'to' }),
            isntInMyFriendList({ fieldName:  'to' }),
        ],
    },

    acceptFriendRequest: {
        from: [
            sanitizeInput({ fieldName:  'from' }),
            notEmpty({ fieldName:  'from' }),
            toString({ fieldName:  'from' }),
            isMongoId({ fieldName:  'from' }),
            isUserExistById({ fieldName:  'from' }),
            isInMyIncomingFriendRequests({ fieldName:  'from' }),
        ],
    },

    declineFriendRequest: {
        from: [
            sanitizeInput({ fieldName:  'from' }),
            notEmpty({ fieldName:  'from' }),
            toString({ fieldName:  'from' }),
            isMongoId({ fieldName:  'from' }),
            isUserExistById({ fieldName:  'from' }),
            isInMyIncomingFriendRequests({ fieldName:  'from' }),
        ],
    },

    revokeFriendRequest: {
        to: [
            sanitizeInput({ fieldName:  'to' }),
            notEmpty({ fieldName:  'to' }),
            toString({ fieldName:  'to' }),
            isMongoId({ fieldName:  'to' }),
            isUserExistById({ fieldName:  'to' }),
            isInMyOutgoingFriendRequests({ fieldName:  'to' }),
        ],
    },

    deleteFriend: {
        targetId: [
            sanitizeInput({ fieldName:  'targetId' }),
            notEmpty({ fieldName:  'targetId' }),
            toString({ fieldName:  'targetId' }),
            isMongoId({ fieldName:  'targetId' }),
            isUserExistById({ fieldName:  'targetId' }),
            isInMyFriendList({ fieldName:  'targetId' }),
        ],
    },

    activateAccount: {
        activationCode: [
            sanitizeInput({ fieldName:  'activationCode' }),
            notEmpty({ fieldName:  'activationCode' }),
            toString({ fieldName:  'activationCode' }),
            isUUID({ fieldName:  'activationCode' }),
        ],
    },

    verifyAccessCode: {
        accessCode: [
            sanitizeInput({ fieldName:  'accessCode' }),
            notEmpty({ fieldName:  'accessCode' }),
            toString({ fieldName:  'accessCode' }),
            isValidAccessCode({ fieldName:  'accessCode' }),
        ],
    },
};

export const UserValidator = createValidator(userValidators);