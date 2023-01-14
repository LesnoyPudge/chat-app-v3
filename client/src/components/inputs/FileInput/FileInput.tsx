import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import React, { FC, useId } from 'react';



interface FileInput extends PropsWithChildrenAndClassName {
    name: string;
    accept?: string;
    multiple?: boolean;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    label: 'cursor-pointer block',
    input: 'sr-only [&:focus-visible+*]:focused',
};

export const FileInput: FC<FileInput> = ({
    className = '',
    label,
    name,
    accept = '',
    multiple = false,
    children,
    onChange,
}) => {
    const id = useId();

    return (
        <>
            <input 
                className={styles.input}
                accept={accept}
                multiple={multiple}
                type='file'
                name={name}
                id={id}
                aria-label={label}
                onChange={onChange}
            />

            <label
                className={twClassNames(styles.label, className)}
                htmlFor={id}
            >
                {children}
            </label>
        </>
    );
};