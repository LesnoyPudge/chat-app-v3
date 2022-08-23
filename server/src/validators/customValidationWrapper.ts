import { CustomValidator, ParamSchema } from 'express-validator';



interface ICustomValidatorOptions {
    bail: boolean;
    errorMessage?: string;
}

export type CustomValidatorType = (options?: ICustomValidatorOptions) => ParamSchema;

type CustomValidationWrapperType = (fn: CustomValidator, args?: ICustomValidatorOptions) => ParamSchema;

export const customValidationWrapper: CustomValidationWrapperType = (fn, args = { bail: true }) => {
    return {
        custom: {
            bail: args.bail,
            errorMessage: args?.errorMessage,
            options: fn,
        },
    } as ParamSchema;
};