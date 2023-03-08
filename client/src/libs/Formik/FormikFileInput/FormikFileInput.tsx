import { ChildrenAsNodeOrFunction, FileInput } from '@components';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { encodeFiles, EncodeFilesOptions, EncodeFilesResult, MBToBytes } from '@utils';
import { useField, useFormikContext } from 'formik';
import { FC } from 'react';



interface ChildrenArgs {
    value: EncodedFile[];
}

interface FormikFileInput extends 
PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<ChildrenArgs>,
EncodeFilesOptions {
    name: string;
    label: string; 
    hidden?: boolean;
}

export const FormikFileInput: FC<FormikFileInput> = ({
    className = '',
    name,
    accept = '*',
    multiple = false,
    sizeLimit = MBToBytes(1),
    label,
    hidden = false,
    children,
}) => {
    const [{ value }] = useField<EncodedFile[]>(name);
    const { setFieldValue } = useFormikContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) return;
        
        encodeFiles(Object.values(e.target.files), {
            accept,
            multiple,
            sizeLimit,
        }).then((encodedFiles) => {
            setFieldValue(name, encodedFiles.ok); 
        });
    };

    return (
        <FileInput
            className={className}
            label={label}
            name={name}
            accept={accept}
            multiple={multiple}
            hidden={hidden}
            onChange={handleChange}
        >
            <ChildrenAsNodeOrFunction args={{ value }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </FileInput>
    );
};