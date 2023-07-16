import { useRef } from 'react';



export const useLatest = <T>(providedValue: T): { readonly current: T } => {
    const value = useRef(providedValue);

    value.current = providedValue;

    return value;
};