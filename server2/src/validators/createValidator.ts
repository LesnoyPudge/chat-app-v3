import { ApiError } from '@errors';
import { objectKeys } from '@shared';
import { AuthorizedRequest, Middleware } from '@types';
import { ValidationChain, validationResult } from 'express-validator';
import { ContextBuilder } from 'express-validator/src/context-builder';
import { ContextItem } from 'express-validator/src/context-items';
import { Bail } from 'express-validator/src/context-items/bail';



type NestedObject = Record<string, Record<string, unknown>>;

type Schema<InitialSchema extends NestedObject> = {
    [K in keyof InitialSchema]: (req: AuthorizedRequest<InitialSchema[K]>) => Record<
        keyof Required<InitialSchema[K]>,
        ValidationChain[] | ValidationChain
    >
};

const addBailToStack = (builder: ContextBuilder) => {
    const stack = (builder as unknown as {stack: ContextItem[]}).stack;
    (builder as unknown as {stack: ContextItem[]}).stack = stack.map((item) => {
        return [item, new Bail()];
    }).flat();
};

const shareMessageInStack = (builder: ContextBuilder) => {
    const stack = (builder as unknown as {stack: ContextItem[]}).stack;
    const reversedStack = [...stack].reverse();
    const lastValidator = reversedStack.find((item) => {
        return 'validator' in item;
    });

    if (!lastValidator) return;

    const lastMessage = (
        'message' in lastValidator && typeof lastValidator.message === 'string'
            ? lastValidator.message || ApiError.badRequest().message
            : ApiError.badRequest().message
    );

    let currentMessage = lastMessage;

    const newStack = reversedStack.map((item) => {
        if (!('validator' in item)) return item;

        if ('message' in item && typeof item.message === 'string') {
            currentMessage = item.message;
            return item;
        }

        (item as unknown as ContextItem & {message: string}).message = currentMessage;

        return item;
    }).reverse();

    (builder as unknown as {stack: ContextItem[]}).stack = newStack;
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
                addBailToStack(chain.builder);
                shareMessageInStack(chain.builder);

                chain.builder.setRequestBail();

                const result = await chain.run(req);
                if (result.context.errors.length) break;
            }

            const errors = validationResult(req).array();
            if (!errors.length) return next();

            const firstError = errors[0];

            let errorMessage: string | undefined = undefined;

            if (typeof firstError.msg === 'string') {
                errorMessage = firstError.msg;
            }

            const error = ApiError.badRequest(errorMessage);

            next(error);
        };
    });

    return result;
};