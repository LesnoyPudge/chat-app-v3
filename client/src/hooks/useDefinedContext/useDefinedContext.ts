import { Context, useContext } from 'react';



export const useDefinedContext = <T>(context: Context<T>): NonNullable<T> => {
    const value = useContext(context);

    if (value === undefined || value === null) {
        throw new Error('Context value is not defined');
    }

    return value;
};