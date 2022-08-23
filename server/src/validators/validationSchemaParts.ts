import { UserServiceHelpers } from '@services';
import { password } from '@utils';
import { ParamSchema } from 'express-validator';
import { customValidationWrapper, CustomValidatorType } from './customValidationWrapper';



const { isPasswordsEquals } = password;

export const isUserExistByIdSchemaPart: CustomValidatorType = (options) => {
    return customValidationWrapper(async(userId: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ _id: userId });
        if (!isExist) return Promise.reject('Пользователь не найден');
    }, options);
};

export const isValidLogin: CustomValidatorType = (options) => {
    return customValidationWrapper(async(login: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ login });
        if (!isExist) return Promise.reject('Неверный логин или пароль');
    }, options);
};

export const isValidPassword: CustomValidatorType = (options) => {
    return customValidationWrapper(async(password: string, { req }) => {
        const user = await UserServiceHelpers.getOne({ _id: req.auth.user.id });
        const isEqueals = await isPasswordsEquals({ password, hashedPassword: user.password });
        if (!isEqueals) return Promise.reject('Неверный логин или пароль');
    }, options);
};

export const isLoginOccupiedSchemaPart: CustomValidatorType = (options) => {
    return customValidationWrapper(async(login: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ login });
        if (isExist) return Promise.reject('Логин уже используется');
    }, options);
};

export const notEmptySchemaPart = (errorMessage = 'Значение не указано'): ParamSchema => {
    return {
        trim: true,
        escape: true,
        notEmpty: {
            bail: true,
            errorMessage,
        },
    };
};

export const toStringSchemaPart = (): ParamSchema => {
    return {
        customSanitizer: {
            options: (value) => {
                if (typeof value === 'string') return value;
                return String(value);
            },
        },
    };
};

export const isEmailOccupiedSchemaPart: CustomValidatorType = (options) => {
    return customValidationWrapper(async(email: string) => {
        const isExist = await UserServiceHelpers.isUserExist({ email });
        if (isExist) return Promise.reject('Указанная почта уже используется');
    }, options);
};

export const nullableSchemaPart = (): ParamSchema => {
    return {
        trim: true,
        escape: true,
        exists: {
            options: {
                checkFalsy: true,
                checkNull: true,
            },
            if: (value: unknown) => {
                if (!value) return Promise.reject();
                return Promise.resolve();
            },
        },
    };
};

export const isEmail = (): ParamSchema => {
    return {
        toLowerCase: true,
        normalizeEmail: true,
        isEmail: {
            bail: true,
            errorMessage: 'Почта введена некорректно',
        },
    };
};