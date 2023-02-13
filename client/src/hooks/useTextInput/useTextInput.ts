import { ChangeEvent, useDeferredValue, useState } from 'react';



export const useTextInput = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);
    const deferredValue = useDeferredValue(value);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleReset = () => setValue('');

    const handleResetToInitial = () => setValue(initialValue);

    return {
        value,
        deferredValue,
        handleChange,
        handleReset,
        handleResetToInitial,
    };
};