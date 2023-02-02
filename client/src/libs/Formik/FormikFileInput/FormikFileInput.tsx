import { ChildrenAsNodeOrFunction, FileInput } from '@components';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { encodeFiles } from '@utils';
import { useField, useFormikContext } from 'formik';
import { FC } from 'react';



type ReturnValue<MULTIPLE extends boolean> = MULTIPLE extends false ? EncodedFile | null : EncodedFile[] | null;

interface ChildrenArgs<MULTIPLE extends boolean> {
    value: ReturnValue<MULTIPLE>
}

interface FormikFileInput<MULTIPLE extends boolean = false> extends 
PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<ChildrenArgs<MULTIPLE>> {
    name: string;
    accept?: string;
    multiple?: MULTIPLE;
    label: string; 
    hidden?: boolean;
}

export const FormikFileInput: FC<FormikFileInput> = ({
    className = '',
    name,
    accept,
    multiple = false,
    label,
    hidden = false,
    children,
}) => {
    const [{ value }] = useField(name);
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
            hidden={hidden}
            onChange={handleChange}
        >
            <ChildrenAsNodeOrFunction args={{ value }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </FileInput>
    );
};