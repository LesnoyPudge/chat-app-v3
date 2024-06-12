// / <reference types="../shared/sharedDeclaration.d.ts" />
import '../shared/sharedDeclaration.d.ts';
import R from 'react';
import 'formik';




declare module 'react' {
    function createContext<_T>(defaultValue?: _T): R.Context<_T>;
}

declare module 'formik' {
    declare const Form: R.FC<R.HTMLAttributes<HTMLFormElement>>;

    // interface FormikHelpers<Values> {
    //     setFieldValue: <_Key extends keyof Values>(
    //         field: _Key | null,
    //         value: any,
    //         shouldValidate?: boolean
    //     ) => void;
    // }
}