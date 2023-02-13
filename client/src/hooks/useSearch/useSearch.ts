import React, { useDeferredValue, useState } from 'react';



export const useSearch = () => {
    const [searchValue, setSearchValue] = useState('');
    const deferredSearchValue = useDeferredValue(searchValue);
    
    const handleReset = () => setSearchValue('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    
    return {
        deferredSearchValue,
        searchValue,
        handleChange,
        handleReset,
    };
};