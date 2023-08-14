import { EncodedFile, InvalidEncodedFile } from '@types';
import { MIME } from '@vars';
import { ValueOf } from 'ts-essentials';



export interface EncodeFilesResult {
    ok: EncodedFile[];
    bad: InvalidEncodedFile[];
}

export interface EncodeFilesOptions {
    amountLimit: number;
    accept: ValueOf<typeof MIME>;
    sizeLimit: number;
}

const toBase64 = async(file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = () => resolve('');
    });
};

export const encodeFiles = async(
    files: File[],
    options: EncodeFilesOptions,
): Promise<EncodeFilesResult> => {
    const result: EncodeFilesResult = {
        ok: [],
        bad: [],
    };

    await Promise.all(files.map(async(file) => {
        const isInLimit = file.size <= options.sizeLimit;
        const isTypeAcceptable = (
            options.accept === MIME.ALL
                ? true
                : file.type.includes(options.accept)
        );
        const isBad = !isTypeAcceptable || !isInLimit;

        const okLimitReached = result.ok.length >= options.amountLimit;
        const badLimitReached = result.bad.length >= options.amountLimit;


        if (isBad && !badLimitReached) {
            return result.bad.push({
                reason: !isTypeAcceptable ? 'type' : 'size',
                name: file.name,
                size: file.size,
                type: file.type,
            });
        }

        if (okLimitReached) return;

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