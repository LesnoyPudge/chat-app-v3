import { ParamSchema } from 'express-validator';
import { isEmail, isEmailOccupied, isLoginOccupied, isUserExistById, isUsersExistsById, isValidLogin, isValidPassword, notEmpty, isArray, nullable, toString, isMongoId, sanitizeInput, isArrayOfMongoIds } from './validationSchemaParts';



interface ISingleFields {
    notOccupiedEmail: ParamSchema;
    notOccupiedLogin: ParamSchema;
    username: ParamSchema;
    password: ParamSchema;
    userId: ParamSchema;
    validLogin: ParamSchema;
    validPassword: ParamSchema;
    userIds: ParamSchema;
}

export const singleFields: ISingleFields = {
    notOccupiedEmail: {
        ...nullable(),
        ...sanitizeInput(),
        ...notEmpty(),
        ...toString(),
        ...isEmail(),
        ...isEmailOccupied(),
    },

    notOccupiedLogin: {
        ...sanitizeInput(),
        ...notEmpty(),
        ...toString(),
        ...isLoginOccupied(),
    },

    username: {
        ...sanitizeInput(),
        ...notEmpty(),
        ...toString(),
    },

    password: {
        ...sanitizeInput(),
        ...notEmpty(),
        ...toString(),
    },

    userId: {
        ...sanitizeInput(),
        ...notEmpty(),
        ...isMongoId(),
        ...isUserExistById(),
    },

    validLogin: {
        ...sanitizeInput(),
        ...notEmpty(),
        ...toString(),
        ...isValidLogin(),
    },

    validPassword: {
        ...sanitizeInput(),
        ...notEmpty(),
        ...toString(),
        ...isValidPassword(),
    },

    userIds: {
        ...notEmpty(),
        ...isArray(),
        ...isArrayOfMongoIds(),
        // ...isUsersExistsById(),
    },
};