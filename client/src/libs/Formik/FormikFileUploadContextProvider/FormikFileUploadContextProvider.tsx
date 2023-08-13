import { ChildrenAsNodeOrFunction } from '@components';
import { UseFileUploadListeners, UseFileUploadListener, FileUploadHandler, UseFileUploadOptions, useFileUpload } from '@hooks';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction } from '@types';
import { noop } from '@utils';
import { useField } from 'formik';
import React, { createContext, FC, useRef } from 'react';



type AddErrorListener = Record<keyof UseFileUploadListeners, (cb: UseFileUploadListener) => void>;

interface FileInputProps {
    name: string;
    label: string;
    accept: string;
    multiple: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type FormikFileUploadContext = {
    value: EncodedFile[];
    fileInputProps: FileInputProps;
    addErrorListener: AddErrorListener;
    removeFiles: () => void;
    removeFile: (indexToDelete: number) => void;
    handleFileUpload: FileUploadHandler;
}

interface FormikFileUploadContextProvider
extends PropsWithChildrenAsNodeOrFunction<FormikFileUploadContext> {
    name: string;
    label: string;
    options?: UseFileUploadOptions;
}

export const FormikFileUploadContext = createContext(undefined as unknown as FormikFileUploadContext);

export const FormikFileUploadContextProvider: FC<FormikFileUploadContextProvider> = ({
    name,
    label,
    options = {},
    children,
}) => {
    const [{ value }, _, { setValue }] = useField<EncodedFile[]>(name);

    const errorListenersRef = useRef<UseFileUploadListeners>({
        onAmountLimit: noop,
        onSizeLimit: noop,
        onUnacceptableType: noop,
    });

    const handleFileUpload = useFileUpload(
        value.length,
        (filesToAdd) => {
            console.log('set', value, filesToAdd);
            setValue([...value, ...filesToAdd]);
        },
        options,
        errorListenersRef.current,
    );

    const removeFiles = () => setValue([]);

    const removeFile = (indexToDelete: number) => setValue(value.filter((_, index) => index !== indexToDelete));

    const addErrorListener: AddErrorListener = {
        onAmountLimit: (cb) => errorListenersRef.current.onAmountLimit = cb,
        onSizeLimit: (cb) => errorListenersRef.current.onSizeLimit = cb,
        onUnacceptableType: (cb) => errorListenersRef.current.onUnacceptableType = cb,
    };

    const fileInputProps: FileInputProps = {
        name,
        label,
        multiple: options.amountLimit ? options.amountLimit > 1 : true,
        accept: options.accept || '*',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files),
    };

    const contextValues: FormikFileUploadContext = {
        value,
        fileInputProps,
        addErrorListener,
        removeFiles,
        removeFile,
        handleFileUpload,
    };

    return (
        <FormikFileUploadContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </FormikFileUploadContext.Provider>
    );
};