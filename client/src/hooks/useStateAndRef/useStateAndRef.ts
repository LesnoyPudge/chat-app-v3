import { MutableRefObject, useState } from 'react';
import { useLatest } from '@hooks';



export const useStateAndRef = <T>(initialValue: T):
[T, MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(initialValue);
    const valueRef = useLatest(value);

    // const setValue: typeof setValueState = (action) => {
    //     setValueState((prev) => {
    //         const result = isCallable(action) ? action(prev) : action;
    //         valueRef.current = result;
    //         return result;
    //     });
    // };

    return [value, valueRef, setValue];
};