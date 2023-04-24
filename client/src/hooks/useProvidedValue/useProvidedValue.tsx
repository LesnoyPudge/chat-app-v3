import { useEffect, useState } from 'react';



export const useProvidedValue = <T,>(providedValue: T):
[T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(providedValue);
    
    useEffect(() => {
        if (providedValue === null || providedValue === undefined) return;
        
        setValue(providedValue);
    }, [providedValue]);

    return [value, setValue];
};