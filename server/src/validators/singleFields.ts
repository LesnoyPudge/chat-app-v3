import { ParamSchema } from 'express-validator';
import { isEmail, isEmailOccupiedSchemaPart, isLoginOccupiedSchemaPart, isUserExistByIdSchemaPart, isValidLogin, isValidPassword, notEmptySchemaPart, nullableSchemaPart, toStringSchemaPart } from './validationSchemaParts';



interface ISingleFields {
    notOccupiedEmail: ParamSchema;
    notOccupiedLogin: ParamSchema;
    username: ParamSchema;
    password: ParamSchema;
    userId: ParamSchema;
    validLogin: ParamSchema;
    validPassword: ParamSchema;
}

export const singleFields: ISingleFields = {
    notOccupiedEmail: {
        ...nullableSchemaPart(),
        ...toStringSchemaPart(),
        ...isEmail(),
        ...isEmailOccupiedSchemaPart(),
    },

    notOccupiedLogin: {
        ...notEmptySchemaPart(),
        ...toStringSchemaPart(),
        ...isLoginOccupiedSchemaPart(),
    },

    username: {
        ...notEmptySchemaPart(),
        ...toStringSchemaPart(),
    },

    password: {
        ...notEmptySchemaPart(),
        ...toStringSchemaPart(),
    },

    userId: {
        ...notEmptySchemaPart(),
        ...toStringSchemaPart(),
        ...isUserExistByIdSchemaPart(),
    },

    validLogin: {
        ...notEmptySchemaPart(),
        ...toStringSchemaPart(),
        ...isValidLogin(),
    },

    validPassword: {
        ...notEmptySchemaPart(),
        ...toStringSchemaPart(),
        ...isValidPassword(),
    },
};