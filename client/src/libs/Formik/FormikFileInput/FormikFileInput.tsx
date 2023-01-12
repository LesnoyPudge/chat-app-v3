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
    wrapper: 'relative',
    input: 'absolute z-[1] inset-0 opacity-0 text-0 cursor-pointer peer',
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
            <input 
                className={styles.input}
                accept={accept}
                multiple={multiple}
                type='file'
                name={name}
                aria-label={label}
                onChange={handleChange}
            />
            
            <ChildrenAsNodeOrFunction args={{ files: value }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </div>
    );
};