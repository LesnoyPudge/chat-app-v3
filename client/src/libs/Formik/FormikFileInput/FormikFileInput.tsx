import { ChildrenAsNodeOrFunction, FileInput } from '@components';
import { FileUploadHandler, UseFileUploadErrorHandlers, useFileUpload } from '@hooks';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction } from '@types';
import { EncodeFilesOptions } from '@utils';
import { useField } from 'formik';
import { StrictOmit } from 'ts-essentials';



type FileInputProps = StrictOmit<FileInput, 'children' | 'className'>;

type Value<MULTIPLE extends boolean> = (
    MULTIPLE extends true
        ? (EncodedFile | undefined)[]
        : (EncodedFile | undefined)
)

export type FormikFileInputChildrenArgs<MULTIPLE extends boolean> = {
    value: Value<MULTIPLE>;
    fileInputProps: FileInputProps;
    removeFiles: () => void;
    removeFile: (indexToDelete: MULTIPLE extends true ? number : void) => void;
    handleFileUpload: FileUploadHandler;
}

export interface FormikFileInputProps<MULTIPLE extends boolean>
extends PropsWithChildrenAsNodeOrFunction<FormikFileInputChildrenArgs<MULTIPLE>>,
UseFileUploadErrorHandlers {
    name: string;
    label: string;
    options: EncodeFilesOptions;
    multiple?: MULTIPLE,
}

export const FormikFileInput = <MULTIPLE extends boolean = false>({
    label,
    name,
    options,
    multiple = false as MULTIPLE,
    onAmountLimit,
    onSizeLimit,
    onUnacceptableType,
    children,
}: FormikFileInputProps<MULTIPLE>) => {
    const [{ value }, _, { setValue }] = useField<Value<MULTIPLE>>(name);

    const currentFileAmount = Array.isArray(value) ? value.length : 0;

    const handleFileUpload = useFileUpload(
        currentFileAmount,
        (filesToAdd) => {
            const newValue = (
                multiple
                    ? [...value as EncodedFile[], ...filesToAdd]
                    : filesToAdd[0]
            ) as typeof value;

            setValue(newValue);
        },
        options,
        {
            onAmountLimit,
            onSizeLimit,
            onUnacceptableType,
        },
    );

    const removeFiles = () => setValue((multiple ? [] : undefined) as Value<MULTIPLE>);

    const removeFile = (indexToDelete: MULTIPLE extends true ? number : void) => {
        const newValue = (
            multiple
                ? (value as EncodedFile[]).filter((_, index) => index !== indexToDelete)
                : undefined
        ) as typeof value;

        setValue(newValue);
    };

    const fileInputProps: FileInputProps = {
        name,
        label,
        multiple: multiple,
        accept: options.accept,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files),
    };

    const childrenArgs: FormikFileInputChildrenArgs<MULTIPLE> = {
        value,
        fileInputProps,
        removeFiles,
        removeFile,
        handleFileUpload,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};