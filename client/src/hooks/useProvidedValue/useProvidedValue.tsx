import { useLatest } from '@hooks';
import { useEffect, useState } from 'react';



type UseProvidedValueReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>]

export const useProvidedValue = <T,>(providedValue: T): UseProvidedValueReturn<T> => {
    const [value, setValue] = useState(providedValue);
    const latestValueRef = useLatest(value);

    useEffect(() => {
        if (providedValue === null || providedValue === undefined) return;
        if (latestValueRef.current === providedValue) return;

        setValue(providedValue);
    }, [providedValue, latestValueRef]);

    return [value, setValue];
};