import { ChildrenAsNodeOrFunction, FileInput } from '@components';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { encodeFiles } from '@utils';
import { useField, useFormikContext } from 'formik';
import { FC } from 'react';



interface ChildrenArgs {
    files: EncodedFile[] | null;
}

interface FormikFileInput extends 
PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    name: string;
    accept?: string;
    multiple?: boolean;
    label: string; 
}

export const FormikFileInput: FC<FormikFileInput> = ({
    className = '',
    name,
    accept,
    multiple,
    label,
    children,
}) => {
    const [{ value: files }] = useField(name);
    const { setFieldValue } = useFormikContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) return;
        
        encodeFiles(Object.values(e.target.files)).then((encodedFiles) => {
            setFieldValue(name, encodedFiles); 
        });
    };

    return (
        <FileInput
            className={className}
            label={label}
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
        >
            <ChildrenAsNodeOrFunction args={{ files }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </FileInput>
    );
};