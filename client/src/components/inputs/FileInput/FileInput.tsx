import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import React, { FC } from 'react';



interface FileInput extends PropsWithChildrenAndClassName {
    name: string;
    accept?: string;
    multiple?: boolean;
    label: string;
    tabIndex?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    wrapper: 'relative focus-within:focused',
    input: 'sr-input',
};

export const FileInput: FC<FileInput> = ({
    className = '',
    label,
    name,
    accept = '',
    multiple = false,
    tabIndex = 0,
    children,
    onChange,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <input 
                className={styles.input}
                accept={accept}
                multiple={multiple}
                type='file'
                name={name}
                tabIndex={tabIndex}
                aria-label={label}
                onChange={onChange}
            />

            {children}
        </div>
    );
};