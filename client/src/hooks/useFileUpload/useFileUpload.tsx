import { EncodedFile, InvalidEncodedFile } from '@types';
import { encodeFiles, EncodeFilesOptions, noop } from '@utils';
import { useIsMounted } from 'usehooks-ts';



export type UseFileUploadListener = (badFiles: InvalidEncodedFile[]) => void;

export interface UseFileUploadErrorHandlers {
    onAmountLimit?: UseFileUploadListener;
    onSizeLimit?: UseFileUploadListener;
    onUnacceptableType?: UseFileUploadListener;
}

export type FileUploadHandler = (providedFiles: FileList | null) => void;

export const useFileUpload = (
    currentFilesAmount: number,
    setFiles: (files: EncodedFile[]) => void,
    options: EncodeFilesOptions,
    listeners: UseFileUploadErrorHandlers = {},
): FileUploadHandler => {
    const isMounted = useIsMounted();

    const {
        onAmountLimit = listeners.onAmountLimit || noop,
        onSizeLimit = listeners.onSizeLimit || noop,
        onUnacceptableType = listeners.onUnacceptableType || noop,
    } = listeners;

    const handleFileUpload: FileUploadHandler = (providedFiles) => {
        if (!providedFiles || !providedFiles.length) return;

        encodeFiles(Object.values(providedFiles), options).then((encodedFiles) => {
            if (!isMounted()) return;

            const noSpace = currentFilesAmount === options.amountLimit;
            const notEnoughSpace = currentFilesAmount + encodedFiles.ok.length > options.amountLimit;
            const overSizeLimit = encodedFiles.bad.some((file) => file.reason === 'size');
            const unacceptableType = encodedFiles.bad.some((file) => file.reason === 'type');
            const hasAcceptableFiles = !!encodedFiles.ok.length;
            const filesToSet = encodedFiles.ok.slice(0, options.amountLimit - currentFilesAmount);

            if (noSpace) return onAmountLimit(encodedFiles.bad);
            if (hasAcceptableFiles) setFiles(filesToSet);
            if (notEnoughSpace) return onAmountLimit(encodedFiles.bad);
            if (overSizeLimit) return onSizeLimit(encodedFiles.bad);
            if (unacceptableType) return onUnacceptableType(encodedFiles.bad);
        });
    };

    return handleFileUpload;
};