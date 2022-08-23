import { singleFields as sf } from '../singleFields';
import { IAcceptFriendRequestUserRequest, IActivateAccountUserRequest, IBlockUserRequest, IChangeAvatarUserRequest, IChangeExtraStatusUserRequest, IChangePasswordUserRequest, IDeclineFriendRequestUserRequest, IDeleteFriendUserRequest, IGetManyUserRequest, IGetOneUserRequest, ILoginUserRequest, IRegistrationUserRequest, IRevokeFriendRequestUserRequest, ISendFriendRequestUserRequest, IUnblockUserRequest, IUpdateUserRequest, IVerifyAccessCodeUserReuqest } from '@types';
import { createValidator, ObjectToSchema } from '../createValidator';



type UserValidatorsType = {
    registration: ObjectToSchema<IRegistrationUserRequest>;
    login: ObjectToSchema<ILoginUserRequest>;
    getOne: ObjectToSchema<IGetOneUserRequest>;
    // getMany: ObjectToSchema<IGetManyUserRequest>;
    // update: ObjectToSchema<IUpdateUserRequest>;
    // blockUser: ObjectToSchema<IBlockUserRequest>;
    // unblockUser: ObjectToSchema<IUnblockUserRequest>;
    // sendFriendRequest: ObjectToSchema<ISendFriendRequestUserRequest>;
    // acceptFriendRequest: ObjectToSchema<IAcceptFriendRequestUserRequest>;
    // declineFriendRequest: ObjectToSchema<IDeclineFriendRequestUserRequest>;
    // revokeFriendRequest: ObjectToSchema<IRevokeFriendRequestUserRequest>;
    // deleteFriend: ObjectToSchema<IDeleteFriendUserRequest>;
    // activateAccount: ObjectToSchema<IActivateAccountUserRequest>;
    // changeAvatar: ObjectToSchema<IChangeAvatarUserRequest>;
    // changePassword: ObjectToSchema<IChangePasswordUserRequest>;
    // changeExtraStatus: ObjectToSchema<IChangeExtraStatusUserRequest>;
    // verifyAccessCode: ObjectToSchema<IVerifyAccessCodeUserReuqest>;
}

const userValidators: UserValidatorsType = {
    registration: {
        email: sf.notOccupiedEmail,
        login: sf.notOccupiedLogin,
        username: sf.username,
        password: sf.password,
    },

    login: {
        login: sf.validLogin,
        password: sf.validPassword,
    },

    getOne: {
        targetId: sf.userId,
    },

    // getMany: {},

    // update: {},

    // blockUser: {},

    // unblockUser: {},

    // sendFriendRequest: {},

    // acceptFriendRequest: {},

    // declineFriendRequest: {},

    // revokeFriendRequest: {},

    // deleteFriend: {},

    // activateAccount: {},

    // changeAvatar: {},

    // changePassword: {},

    // changeExtraStatus: {},

    // verifyAccessCode: {},
};

export const UserValidator = createValidator(userValidators);