import { EncodedFile } from '@types';
import { useRef } from 'react';



type UseFilesArgs = {
    accept?: string;
    multiple?: boolean;
};

type OnChange = (cb: (files: EncodedFile[] | null) => void) => void;

type UseFiles = (options: UseFilesArgs) => {
    open: () => void;
    onChange: OnChange;
}

export const useFiles: UseFiles = ({ accept = '', multiple = false }) => {
    const fileInputRef = useRef(document.createElement('input'));

    fileInputRef.current.type = 'file';
    fileInputRef.current.accept = accept;
    fileInputRef.current.multiple = multiple;

    const onChange: OnChange = (cb) => fileInputRef.current.onchange = async() => {
        if (!fileInputRef.current.files) {
            cb(null);
            return;
        }

        const files = await encodeFiles(Object.values(fileInputRef.current.files));

        cb(files);
    };

    const encodeFiles = async(files: File[]) => {
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
    };

    const toBase64 = async(file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString() || '');
            reader.onerror = () => resolve('');
        });
    };

    const open = () => {
        fileInputRef.current.click();
    };

    return {
        onChange,
        open,
    };
};