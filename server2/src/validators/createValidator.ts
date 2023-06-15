import { ApiError } from '@errors';
import { objectKeys } from '@shared';
import { AuthorizedRequest, Middleware } from '@types';
import { ValidationChain, validationResult } from 'express-validator';
import { ContextItem } from 'express-validator/src/context-items';
import { Bail } from 'express-validator/src/context-items/bail';



type NestedObject = Record<string, Record<string, unknown>>;

type Schema<InitialSchema extends NestedObject> = {
    [K in keyof InitialSchema]: (req: AuthorizedRequest<InitialSchema[K]>) => Record<
        keyof Required<InitialSchema[K]>,
        ValidationChain[] | ValidationChain
    >
};

export const createValidator = <InitialSchema extends NestedObject>(
    rawValidator: Schema<InitialSchema>,
) => {
    const result = {} as Record<
        keyof InitialSchema, 
        Middleware<InitialSchema[keyof InitialSchema]>
    >;

    objectKeys(rawValidator).forEach((key) => {
        result[key] = async(req, _, next) => {
            const values = Object.values(rawValidator[key](req as AuthorizedRequest<InitialSchema[keyof InitialSchema]>)).flat();

            for (const chain of values) {
                const modifiedChain = (chain.builder as unknown as {stack: ContextItem[]}).stack.map((item) => [item, new Bail()]).flat();

                (chain.builder as unknown as {stack: ContextItem[]}).stack = modifiedChain;

                chain.builder.setRequestBail();
                
                const result = await chain.run(req);
                if (result.context.errors.length) break; 
            }

            const errors = validationResult(req).array();
            if (!errors.length) return next();

            const firstError = errors[0];

            let errorMessage: string;

            switch (firstError.type) {
            case 'field':
                errorMessage = `There's an error with field ${firstError.path} in the request ${firstError.location}`;
                break;
            
            default:
                errorMessage = firstError.msg;
                break;
            }

            const error = ApiError.badRequest(errorMessage);

            next(error);
        };
    });

    return result;
};