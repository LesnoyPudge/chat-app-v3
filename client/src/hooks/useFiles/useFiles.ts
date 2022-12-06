import { EncodedFile } from '@types';
import { useCallback, useEffect, useRef, useState } from 'react';



type UseFilesArgs = {
    accept?: string;
    multiple?: boolean;
};

type UseFiles = (options: UseFilesArgs) => {
    openFileLoader: () => void;
    files: EncodedFile[] | null;
}

export const useFiles: UseFiles = ({ accept = '', multiple = false }) => {
    const [files, setFiles] = useState<EncodedFile[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const toBase64 = async(file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString() || '');
            reader.onerror = () => resolve('');
        });
    };

    const encodeFiles = useCallback(async(files: File[]) => {
        return await Promise.all(files.map(async(file): Promise<EncodedFile> => {
            const base64 = await toBase64(file);
        
            return {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                base64,
            };
        }));
    }, []);

    useEffect(() => {
        fileInputRef.current = document.createElement('input');

        const fileInput = fileInputRef.current;

        fileInput.type = 'file';
        fileInput.accept = accept;
        fileInput.multiple = multiple;

        fileInput.onchange = async() => {
            if (!fileInput.files) return;

            const files = await encodeFiles(Object.values(fileInput.files));
            setFiles(files);
        };

    }, [accept, encodeFiles, multiple]);

    const openFileLoader = () => {
        fileInputRef.current && fileInputRef.current.click();
    };

    return {
        files,
        openFileLoader,
    };
};