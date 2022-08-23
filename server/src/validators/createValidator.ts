import { MiddlewareType } from '@types';
import { checkSchema, ParamSchema, Schema, ValidationChain, validationResult } from 'express-validator';
import { ResultWithContext } from 'express-validator/src/chain';
import { Request } from 'express';
import { ApiError } from '@utils';



type ValidationSchemaType = () => ValidationChain[] & {
    run: (req: Request) => Promise<ResultWithContext[]>;
}

interface IValidator {
    [validatorName: string]: Schema;
}

type CreateValidatorOutput<T extends IValidator> = Record<keyof T, MiddlewareType<never, never, never>>

type CreateValidator = <T extends IValidator>(validator: T) => CreateValidatorOutput<T> | CreateValidatorOutput<IValidator>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectToSchema<T extends Record<string, any>> = Record<keyof T, ParamSchema>; 

const validationHandler = (validationSchema: ValidationSchemaType): MiddlewareType<never, never, never> => {
    return (req, res, next) => {
        validationSchema().run(req).then(() => {
            const result = validationResult(req).array();
            const hasError = !!result.length;

            if (hasError) {
                const firstError = result[0];
                const errorMessage = `Validation failed: ${result[0].msg} [причина: ${firstError.param}]`;
                throw ApiError.badRequest(errorMessage);
            }
            
            return next();
        }).catch((error) => next(error));
    };
};

export const createValidator: CreateValidator = (validator) => {
    const result = {} as ReturnType<CreateValidator>;
    
    for (const [key, value] of Object.entries(validator)) {
        const validatior = () => checkSchema(value);
        result[key] = validationHandler(validatior);
    }

    return result;
};