import { UserServiceHelpers } from '@services';
import { MiddlewareType } from '@types';
import { ApiError } from '@utils';
import { check, ValidationChain, validationResult } from 'express-validator';



type ValidationHandlerType = (validations: ValidationChain[]) => MiddlewareType<never, never, never>;

type ValidatorsContainer<T> = Record<keyof T, Record<string, ValidationChain[]>>;
type CreateValidatorOutput<T> = Record<keyof T, MiddlewareType<never, never, never>>;
type CreateValidatorType = <T extends ValidatorsContainer<T>>(validatorsContainer: T) => CreateValidatorOutput<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectToValidatorsChain<T extends Record<string, any>> = Partial<Record<keyof T, ValidationChain[]>>; 

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