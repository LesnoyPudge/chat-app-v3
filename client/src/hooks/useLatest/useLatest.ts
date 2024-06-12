import { MutableRefObject, useRef } from 'react';



export const useLatest = <T>(providedValue: T): MutableRefObject<T> => {
    const value = useRef(providedValue);

    value.current = providedValue;

    return value;
};