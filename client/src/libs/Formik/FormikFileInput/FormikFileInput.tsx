import { ChildrenAsNodeOrFunction } from '@components';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { encodeFiles, twClassNames } from '@utils';
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
    label?: string; 
}

const styles = {
    wrapper: 'relative focus-within:focused',
    input: 'absolute inset-0 opacity-0 text-0 cursor-pointer',
};

export const FormikFileInput: FC<FormikFileInput> = ({
    className = '',
    name,
    accept,
    multiple,
    label,
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
        <div className={twClassNames(styles.wrapper, className)}>
            <ChildrenAsNodeOrFunction args={{ files: value }}>
                {children}
            </ChildrenAsNodeOrFunction>

            <input 
                className={styles.input}
                accept={accept}
                multiple={multiple}
                type='file'
                name={name}
                aria-label={label}
                onChange={handleChange}
            />
        </div>
    );
};