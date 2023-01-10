import { EncodedFile } from '@types';
import { encodeFiles } from '@utils';
import { useRef, useState } from 'react';



type UseFileLoaderArgs = {
    accept?: string;
    multiple?: boolean;
};

type UseFileLoader = (options?: UseFileLoaderArgs) => {
    openFileLoader: () => void;
    files: EncodedFile[] | null;
}

export const useFileLoader: UseFileLoader = ({ accept = '', multiple = false } = {}) => {
    const [files, setFiles] = useState<EncodedFile[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const openFileLoader = () => {
        fileInputRef.current = document.createElement('input');

        const fileInput = fileInputRef.current;

        fileInput.type = 'file';
        fileInput.accept = accept;
        fileInput.multiple = multiple;

        fileInput.onchange = () => {
            if (!fileInput.files) return;

            encodeFiles(Object.values(fileInput.files)).then((encodedFiles) => {
                setFiles(encodedFiles);
            });
        };

        fileInput.click();
    };

    return {
        files,
        openFileLoader,
    };
};