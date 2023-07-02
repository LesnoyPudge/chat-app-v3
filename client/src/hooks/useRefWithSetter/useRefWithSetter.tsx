import { MutableRefObject, useCallback, useRef } from 'react';



export const useRefWithSetter = <T,>(initialValue: T): 
[MutableRefObject<T>, (value: T) => void] => {
    const valueRef = useRef(initialValue);
    
    const setValueRef = useCallback((value: T) => {
        valueRef.current = value;
    }, []);

    return [valueRef, setValueRef];
};