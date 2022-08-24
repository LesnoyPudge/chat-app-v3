import { UserServiceHelpers } from '@services';
import { objectId, password } from '@utils';
import { ParamSchema } from 'express-validator';



const { isObjectId } = objectId;
const { isPasswordsEquals } = password;

export const sanitizeInput = (): ParamSchema => {
    return {
        escape: true,
        trim: true,
    };
};

export const isUserExistById = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Пользователь не найден',
            options: async(userId: string) => {
                const isExist = await UserServiceHelpers.isUserExist({ _id: userId });
                if (!isExist) return Promise.reject();
            },
        },
    };
};

export const isValidLogin = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Неверный логин или пароль',
            options: async(login: string) => {
                const isExist = await UserServiceHelpers.isUserExist({ login });
                if (!isExist) return Promise.reject();
            },
        },
    };
};

export const isValidPassword = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Неверный логин или пароль',
            options: async(password: string, { req }) => {
                const user = await UserServiceHelpers.getOne({ _id: req.auth.user.id });
                const isEqueals = await isPasswordsEquals({ password, hashedPassword: user.password });
                if (!isEqueals) return Promise.reject();
            },
        },
    };
};

export const isLoginOccupied = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Логин уже используется',
            options: async(login: string) => {
                const isExist = await UserServiceHelpers.isUserExist({ login });
                if (isExist) return Promise.reject('Логин уже используется');
            },
        },
    };
};

export const notEmpty = (): ParamSchema => {
    return {
        notEmpty: {
            bail: true,
            errorMessage: 'Значение не указано',
        },
    };
};

export const toString = (): ParamSchema => {
    return {
        customSanitizer: {
            options: (value) => {
                if (typeof value === 'string') return value;
                return String(value);
            },
        },
    };
};

export const isEmailOccupied = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Указанная почта уже используется',
            options: async(email: string) => {
                const isExist = await UserServiceHelpers.isUserExist({ email });
                if (isExist) return Promise.reject('Указанная почта уже используется');
            },
        },
    };
};

export const nullable = (): ParamSchema => {
    return {
        exists: {
            options: {
                checkFalsy: true,
                checkNull: true,
            },
            if: (value: unknown) => {
                if (!value) return Promise.reject();
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

export const isArray = (): ParamSchema => {
    return {
        isArray: {
            bail: true,
            errorMessage: 'Значение должно быть массивом',
        },
    };
};

export const isMongoId = (): ParamSchema => {
    return {
        isMongoId: {
            bail: true,
            errorMessage: 'Значение не является ID',
        },
    };
};

export const isArrayOfMongoIds = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Одно или более значение не является ID',
            options: (arrayOfIds: string[]) => {
                let isValidArray = true;
                
                for (let index = 0; index < arrayOfIds.length; index++) {
                    const isValidId = isObjectId(arrayOfIds[index]);

                    if (!isValidId) {
                        isValidArray = false;
                        break;
                    }
                }
                
                if (!isValidArray) return Promise.reject();
                return Promise.resolve();
            },
        },
    };
};

export const isUsersExistsById = (): ParamSchema => {
    return {
        custom: {
            bail: true,
            errorMessage: 'Один или более пользователь не найден',
            options: async(userIds: string[]) => {
                const users = await UserServiceHelpers.isUsersExists({ _id: { $in: userIds } });
                if (users.length < userIds.length) return Promise.reject('Один или более пользователь не найден');
            },
        },
    };
};