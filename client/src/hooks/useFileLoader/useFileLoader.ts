import { useRef } from 'react';



const fileInput = document.createElement('input');
fileInput.type = 'file';

export const useFileLoader = (accept = '') => {
    fileInput.accept = accept;
    const fileInputRef = useRef(fileInput);

    const onChange = (cb: (files: File[] | null) => void) => fileInputRef.current.onchange = () => {
        const files = fileInputRef.current.files;
        cb(files ? Object.values(files) : files);
    };

    const open = () => {
        fileInputRef.current.click();
    };

    return {
        open,
        onChange,
    };
};