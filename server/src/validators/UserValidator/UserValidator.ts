import { MiddlewareType } from '@types';
import { checkSchema, Schema, ValidationChain, validationResult } from 'express-validator';
import { ResultWithContext } from 'express-validator/src/chain';
import { singleFields } from '../singleFields';
import { Request } from 'express';
import { ApiError } from '@utils';



type ValidationSchemaType = () => ValidationChain[] & {
    run: (req: Request) => Promise<ResultWithContext[]>;
}

interface IValidator {
    [validatorName: string]: Schema;
}

type Output<T extends IValidator> = Record<keyof T, MiddlewareType<never, never, never>>

const validationHandler = (validator: ValidationSchemaType): MiddlewareType<never, never, never> => {
    return (req, res, next) => {
        validator().run(req).then(() => {
            const result = validationResult(req).array();
            if (result.length) throw ApiError.badRequest('Validation failed: ' + result[0].msg);
            
            return next();
        }).catch((error) => next(error));
    };
};

// type CreateValidator = <T extends IValidator>(validator: T) => Output<T>;
type CreateValidator = <T extends IValidator>(validator: T) => Output<T>;

const createValidator: CreateValidator = (validator) => {
    const result = {} as Output< ReturnType<typeof validator>>;
    
    for (const [key, value] of Object.entries(validator)) {
        const validatior = () => checkSchema(value);
        result[key] = validationHandler(validatior);
    }

    return result;
};

export const UserValidator = createValidator({
    registration: {
        email: singleFields.email,
        login: singleFields.login,
        username: singleFields.username,
        password: singleFields.password,
    },
});

UserValidator.registration;

// export const UserValidator = {
//     createUserValidator: () => {
//         return checkSchema({
//             email: singleFields.email,
//             login: singleFields.login,
//             username: singleFields.username,
//             password: singleFields.password,
//         });
//     },
// };

// registration: ServiceType<IRegistrationUserRequest, IAuthResponse>;
// login: ServiceType<ILoginUserRequest, IAuthResponse>;
// logout: ServiceType<{refreshToken: string}, void>;
// refresh: ServiceType<{refreshToken: string}, IAuthResponse>;
// getOne: AuthorizedServiceType<IGetOneUserRequest, IUser>;
// getMany: AuthorizedServiceType<IGetManyUserRequest, IUser[]>;
// update: AuthorizedServiceType<IUpdateUserRequest, IUser>;
// blockUser: AuthorizedServiceType<IBlockUserRequest, IUser>;
// unblockUser: AuthorizedServiceType<IUnblockUserRequest, IUser>;
// requestAccessCode: AuthorizedServiceType<unknown, void>;
// sendFriendRequest: AuthorizedServiceType<ISendFriendRequestUserRequest, IUser>;
// acceptFriendRequest: AuthorizedServiceType<IAcceptFriendRequestUserRequest, IUser>;
// declineFriendRequest: AuthorizedServiceType<IDeclineFriendRequestUserRequest, IUser>;
// revokeFriendRequest: AuthorizedServiceType<IRevokeFriendRequestUserRequest, IUser>;
// deleteFriend: AuthorizedServiceType<IDeleteFriendUserRequest, IUser>;
// requestActivationLink: AuthorizedServiceType<unknown, void>;
// activateAccount: ServiceType<IActivateUserRequest, void>;
// changeAvatar: AuthorizedServiceType<IChangeAvatarUserRequest, IUser>;
// changePassword: AuthorizedServiceType<IChangePasswordUserRequest, void>;
// changeExtraStatus: AuthorizedServiceType<IChangeExtraStatusUserRequest, IUser>;
// verifyAccessCode: AuthorizedServiceType<IVerifyAccessCodeUserReuqest, void>;