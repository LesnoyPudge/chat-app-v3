import { EncodedFile, InvalidEncodedFile } from '@types';
import { encodeFiles, MBToBytes, noop } from '@utils';
import { useIsMounted } from 'usehooks-ts';



export interface UseFileUploadOptions {
    accept?: string;
    amountLimit?: number;
    sizeLimit?: number;
}

export type UseFileUploadListener = (badFiles: InvalidEncodedFile[]) => void;

export interface UseFileUploadListeners {
    onAmountLimit?: UseFileUploadListener;
    onSizeLimit?: UseFileUploadListener;
    onUnacceptableType?: UseFileUploadListener;
}

export type FileUploadHandler = (providedFiles: FileList | null) => void;

export const useFileUpload = (
    currentFilesAmount: number,
    setFiles: (files: EncodedFile[]) => void,
    options: UseFileUploadOptions = {},
    listeners: UseFileUploadListeners = {},
): FileUploadHandler => {
    const isMounted = useIsMounted();

    const {
        accept = options.accept || '*',
        amountLimit = options.amountLimit || 9,
        sizeLimit = options.sizeLimit || MBToBytes(1),
    } = options;

    const {
        onAmountLimit = listeners.onAmountLimit || noop,
        onSizeLimit = listeners.onSizeLimit || noop,
        onUnacceptableType = listeners.onUnacceptableType || noop,
    } = listeners;

    const handleFileUpload: FileUploadHandler = (providedFiles) => {
        if (!providedFiles || !providedFiles.length) return;

        encodeFiles(Object.values(providedFiles), {
            accept,
            sizeLimit,
        }).then((encodedFiles) => {
            if (!isMounted()) return;
            console.log('here');
            const noSpace = currentFilesAmount === amountLimit;
            const notEnoughSpace = currentFilesAmount + encodedFiles.ok.length > amountLimit;
            const overSizeLimit = encodedFiles.bad.some((file) => file.reason === 'size');
            const unacceptableType = encodedFiles.bad.some((file) => file.reason === 'type');
            const hasAcceptableFiles = !!encodedFiles.ok.length;
            const filesToSet = encodedFiles.ok.slice(0, amountLimit - currentFilesAmount);

            if (noSpace) return onAmountLimit(encodedFiles.bad);
            if (hasAcceptableFiles) setFiles(filesToSet);
            if (notEnoughSpace) return onAmountLimit(encodedFiles.bad);
            if (overSizeLimit) return onSizeLimit(encodedFiles.bad);
            if (unacceptableType) return onUnacceptableType(encodedFiles.bad);
        });
    };

    return handleFileUpload;
};