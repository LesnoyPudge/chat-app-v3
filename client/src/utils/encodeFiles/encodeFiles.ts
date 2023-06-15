import { EncodedFile, InvalidEncodedFile } from '@types';
import { MBToBytes } from '@utils';


 
export interface EncodeFilesResult {
    ok: EncodedFile[];
    bad: InvalidEncodedFile[];
}

export interface EncodeFilesOptions {
    multiple?: boolean;
    accept?: string;
    sizeLimit?: number;
}

const toBase64 = async(file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = () => resolve('');
    });
};

export const encodeFiles = async(files: File[], options: EncodeFilesOptions = {}): Promise<EncodeFilesResult> => {
    const {
        accept = '*',
        sizeLimit = MBToBytes(1),
    } = options;

    const result: EncodeFilesResult = {
        ok: [],
        bad: [],
    };

    await Promise.all(files.map(async(file) => {
        const isAcceptable = new RegExp(accept.replace('*', '.*')).test(file.type);
        const isInLimit = file.size <= sizeLimit;

        if (!isAcceptable || !isInLimit) {
            result.bad.push({
                reason: !isAcceptable ? 'type' : 'size',
                name: file.name,
                size: file.size,
                type: file.type,
            });
            
            return;
        }

        const base64 = await toBase64(file);

        result.ok.push({
            name: file.name,
            size: file.size,
            type: file.type,
            base64,
        });
    }));

    return result;
};