import { useEffect, useState } from 'react';



export const useProvidedValue = <T,>(providedValue: T):
[T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(providedValue);

    useEffect(() => {
        setValue(providedValue);
    }, [providedValue]);

    return [value, setValue];
};