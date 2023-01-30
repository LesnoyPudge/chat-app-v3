import { EncodedFile } from '@types';



const toBase64 = async(file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = () => resolve('');
    });
};

export const encodeFiles = async(files: File[], multiple = false) => {
    const encodeFiles = await Promise.all(files.map(async(file): Promise<EncodedFile> => {
        const base64 = await toBase64(file);
    
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            base64,
        };
    }));

    return multiple ? encodeFiles : encodeFiles[0];
};