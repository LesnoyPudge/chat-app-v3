import { IAcceptFriendRequestUserRequest, IActivateAccountUserRequest, IBlockUserRequest, IChangeAvatarUserRequest, IChangeExtraStatusUserRequest, IChangePasswordUserRequest, IDeclineFriendRequestUserRequest, IDeleteFriendUserRequest, IGetManyUserRequest, IGetOneUserRequest, ILoginUserRequest, IRegistrationUserRequest, IRevokeFriendRequestUserRequest, ISendFriendRequestUserRequest, IUnblockUserRequest, IUpdateUserRequest, IVerifyAccessCodeUserReuqest } from '@types';
import { createValidator, ObjectToValidatorsChain } from '../createValidator';
import { nullable, sanitizeInput, notEmpty, isEmail, isEmailUnoccupied, toString, isLoginUnoccupied, isValidLogin, isValidPassword, isMongoId, isUserExistById, isArray, isUsersExistsById, isntInMyBlockList, isntInMyFriendList, isInMyBlockList, isntInMyIncomingFriendRequests, isntInMyOutgoingFriendRequests, isInMyIncomingFriendRequests, isntImInBlockList, isInMyOutgoingFriendRequests, isInMyFriendList, isUUID, isBase64Url, isntSameAsOldPassword, isValidExtraStatus, isValidAccessCode } from '../validationChains';



interface IUserValidators {
    registration: ObjectToValidatorsChain<IRegistrationUserRequest>;
    login: ObjectToValidatorsChain<ILoginUserRequest>;
    getOne: ObjectToValidatorsChain<IGetOneUserRequest>;
    // getMany: ObjectToValidatorsChain<IGetManyUserRequest>;
    update: ObjectToValidatorsChain<IUpdateUserRequest>;
    blockUser: ObjectToValidatorsChain<IBlockUserRequest>;
    unblockUser: ObjectToValidatorsChain<IUnblockUserRequest>;
    sendFriendRequest: ObjectToValidatorsChain<ISendFriendRequestUserRequest>;
    acceptFriendRequest: ObjectToValidatorsChain<IAcceptFriendRequestUserRequest>;
    declineFriendRequest: ObjectToValidatorsChain<IDeclineFriendRequestUserRequest>;
    revokeFriendRequest: ObjectToValidatorsChain<IRevokeFriendRequestUserRequest>;
    deleteFriend: ObjectToValidatorsChain<IDeleteFriendUserRequest>;
    activateAccount: ObjectToValidatorsChain<IActivateAccountUserRequest>;
    changeAvatar: ObjectToValidatorsChain<IChangeAvatarUserRequest>;
    changePassword: ObjectToValidatorsChain<IChangePasswordUserRequest>;
    changeExtraStatus: ObjectToValidatorsChain<IChangeExtraStatusUserRequest>;
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

    // getMany: {
    //     targetIds: [
    //         isArray({ fieldName:  'targetIds' }),
    //         notEmpty({ fieldName:  'targetIds' }),
    //         sanitizeInput({ fieldName:  'targetIds.*' }),
    //         toString({ fieldName:  'targetIds.*' }),
    //         notEmpty({ fieldName:  'targetIds.*' }),
    //         isMongoId({ fieldName:  'targetIds.*', plural: true }),
    //         isUsersExistsById({ fieldName:  'targetIds' }),
    //     ],
    // },

    update: {
        newValues: [
            nullable({ fieldName:  'newValues.username' }),
            sanitizeInput({ fieldName:  'newValues.username' }),
            notEmpty({ fieldName:  'newValues.username' }),
            toString({ fieldName:  'newValues.username' }),
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

    changeAvatar: {
        filename: [
            sanitizeInput({ fieldName:  'filename' }),
            notEmpty({ fieldName:  'filename' }),
            toString({ fieldName:  'filename' }),
        ],

        base64url: [
            sanitizeInput({ fieldName:  'base64url' }),
            notEmpty({ fieldName:  'base64url' }),
            toString({ fieldName:  'base64url' }),
            isBase64Url({ fieldName:  'base64url' }),
        ],
    },

    changePassword: {
        oldPassord: [
            sanitizeInput({ fieldName:  'oldPassword' }),
            notEmpty({ fieldName:  'oldPassword' }),
            toString({ fieldName:  'oldPassword' }),
            isValidPassword({ fieldName:  'oldPassword' }),
        ],
        
        newPassword: [
            sanitizeInput({ fieldName:  'newPassword' }),
            notEmpty({ fieldName:  'newPassword' }),
            toString({ fieldName:  'newPassword' }),
            isntSameAsOldPassword({ fieldName:  'newPassword' }),
        ],
    },

    changeExtraStatus: {
        extraStatus: [
            sanitizeInput({ fieldName:  'extraStatus' }),
            notEmpty({ fieldName:  'extraStatus' }),
            toString({ fieldName:  'extraStatus' }),
            isValidExtraStatus({ fieldName:  'extraStatus' }),
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