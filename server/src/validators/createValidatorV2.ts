import { UserServiceHelpers } from '@services';
import { MiddlewareType } from '@types';
import { ApiError } from '@utils';
import { body, checkSchema, ValidationChain, validationResult } from 'express-validator';



type ValidationHandlerType = (validations: ValidationChain[]) => MiddlewareType<never, never, never>;

type ValidatorsContainer<T> = Record<keyof T, Record<string, ValidationChain[]>>;
type CreateValidatorOutput<T> = Record<keyof T, MiddlewareType<never, never, never>>;
type CreateValidatorType = <T extends ValidatorsContainer<T>>(validatorsContainer: T) => CreateValidatorOutput<T>;

export type ObjectToValidatorsContainer<T extends Record<string, unknown>> = Partial<Record<keyof T, ValidationChain[]>>; 

const validate: ValidationHandlerType = (validations) => {
    return async(req, res, next) => {
        try {
            for (const validation of validations) {
                const result = await validation.run(req);
                if (result.array().length) break; 
            }

            const errors = validationResult(req).array();
            const hasErrors = errors.length > 0;
            
            if (hasErrors) {
                const firstError = errors[0];
                
                const errorMessage = [
                    `Validation failed: ${firstError.msg}`,
                    `[param: ${firstError.param}, value: ${firstError.value}]`,
                ].join(' ');

                throw ApiError.badRequest(errorMessage);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export const createValidator: CreateValidatorType = (validatorsContainer) => {
    const result = {} as CreateValidatorOutput<typeof validatorsContainer>;
    
    for (const [key, value] of Object.entries(validatorsContainer as ValidatorsContainer<never>)) {
        for (const [_, validationChain] of Object.entries(value)) {
            result[key] = validate([...validationChain]);
        } 
    }

    return result;
};


type ValidationChainCreator = (args: {fieldName: string, errorMessage?: string}) => ValidationChain;

const sanitizeInput: ValidationChainCreator = ({ fieldName }) => {
    return body(fieldName).trim().escape();
};

const notEmpty: ValidationChainCreator = ({ 
    fieldName, 
    errorMessage = 'Значение не указано', 
}) => {
    return body(fieldName).notEmpty().bail().withMessage(errorMessage);
};

const isArray: ValidationChainCreator = ({ 
    fieldName, 
    errorMessage = 'Значение должно быть не пустым массивом', 
}) => {
    return body(fieldName).isArray({ min: 1 }).bail().withMessage(errorMessage);
};

const isMongoId: ValidationChainCreator = ({ 
    fieldName, 
    errorMessage = 'Значение не является ID', 
}) => {
    return body(fieldName).isMongoId().bail().withMessage(errorMessage);
};

const isUsersExistsById: ValidationChainCreator = ({ 
    fieldName, 
    errorMessage = 'Один или более пользователь не найден', 
}) => {
    return body(fieldName).custom(async(userIds) => {
        const users = await UserServiceHelpers.isUsersExists({ _id: { $in: userIds } });
        const uniqueIds = new Set(userIds);
        if (users.length < uniqueIds.size) return Promise.reject();
        return Promise.resolve();
    }).bail().withMessage(errorMessage);
};


interface qwe {
    getMany: ObjectToValidatorsContainer<{targetIds: string[]}>;
}

const validators: qwe = {
    getMany: {
        targetIds: [
            notEmpty({ fieldName: 'targetIds' }),
            isArray({ fieldName: 'targetIds' }),
            sanitizeInput({ fieldName: 'targetIds.*' }),
            isMongoId({ fieldName: 'targetIds.*', errorMessage: 'Одно или более значение не является ID' }),
            isUsersExistsById({ fieldName: 'targetIds' }),
        ],
    },
};

export const newUserValidator = createValidator(validators);