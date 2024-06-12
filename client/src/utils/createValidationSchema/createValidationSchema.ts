import { yup } from '@reExport';
import { VALIDATION_MESSAGES } from '@vars';
import { AnyArray, ToType, Writable } from '@shared';
import { AnyRecord } from 'ts-essentials/dist/any-record';



type ConditionalSchema<T> = (
    T extends string
        ? yup.StringSchema
        : T extends number
            ? yup.NumberSchema
            : T extends boolean
                ? yup.BooleanSchema
                : ToType<T> extends Record<string | number, unknown>
                    ? any
                    : T extends AnyArray
                        ? yup.ArraySchema<any, any, any, any>
                        : yup.AnySchema
);

// type ConditionalSchema<_Value> = (
//     _Value extends Writable<AnyArray> ?
//         yup.ArraySchema<_Value, unknown>
//         : never
// );

type Shape<_Form> = {
    [_Key in keyof _Form]: ConditionalSchema<_Form[_Key]>;
};

// type CallbackArg = {
//     yup: typeof yup,
//     VALIDATION_MESSAGES: typeof VALIDATION_MESSAGES,
// }

// type Some = {
//     data: 'qwe',
//     arr: {some: 5}[]
// }


// export type Shape2<Fields extends Record<string, unknown>> = {
//     [Key in keyof Fields]: ConditionalSchema<Fields[Key]>;
// };
  
// export type UserFields = {
//     firstName: string;
//     lastName?: string[];
// };
  
// const validationSchema = yup.object<Shape2<UserFields>>({
//     firstName: yup.string().default(''),
//     lastName: yup.string().default(''),
// });

export const createValidationSchema = <_Form>(
    fn: (props: {
        yup: typeof yup,
        VALIDATION_MESSAGES: typeof VALIDATION_MESSAGES,
    }) => Shape<_Form>,
) => {
    return yup.object(fn({
        yup,
        VALIDATION_MESSAGES,
    }));
};