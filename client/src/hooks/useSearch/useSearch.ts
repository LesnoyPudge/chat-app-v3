import React, { useState } from 'react';



export const useSearch = () => {
    const [searchValue, setSearchValue] = useState('');

    const handleReset = () => setSearchValue('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return {
        searchValue,
        handleChange,
        handleReset,
    };
};