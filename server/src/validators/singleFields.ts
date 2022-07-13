import { ParamSchema } from 'express-validator';



interface ISingleFields {
    email: ParamSchema;
    login: ParamSchema;
    username: ParamSchema;
    password: ParamSchema;
}

export const singleFields: ISingleFields = {
    email: {
        trim: true,
        escape: true,
        normalizeEmail: true,
        isEmail: true,
        notEmpty: true,
        toLowerCase: true,
        errorMessage: 'wrong email',
    },
    login: {
        trim: true,
        escape: true,
        notEmpty: true,
        toLowerCase: true,
        errorMessage: 'wrong login',
    },
    username: {
        trim: true,
        escape: true,
        notEmpty: true,
        errorMessage: 'wrong username',
    },
    password: {
        trim: true,
        escape: true,
        toLowerCase: true,
        notEmpty: true,
        errorMessage: 'wrong password',
    },
};