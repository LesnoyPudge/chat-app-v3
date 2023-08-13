import { yup } from '@reExport';
import { VALIDATION_MESSAGES } from '@vars';
import { AnyArray, ToType } from '@shared';



type ConditionalSchema<T> = (
    T extends string
        ? yup.StringSchema
        : T extends number
            ? yup.NumberSchema
            : T extends boolean
                ? yup.BooleanSchema
                : ToType<T> extends Record<string | number, unknown>
                    ? yup.AnyObjectSchema
                    : T extends AnyArray
                        ? yup.ArraySchema<any, any, any, any>
                        : yup.AnySchema
);

type Shape<Fields> = {
    [Key in keyof Fields]: ConditionalSchema<Fields[Key]>;
};

type CallbackArg = {
    yup: typeof yup,
    VALIDATION_MESSAGES: typeof VALIDATION_MESSAGES,
}

export const createValidationSchema = <T>(fn: (v: CallbackArg) => Shape<T>) => {
    return yup.object(fn({
        yup,
        VALIDATION_MESSAGES,
    }));
};