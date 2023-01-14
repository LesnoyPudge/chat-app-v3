import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useId } from 'react';



interface CheckBox extends PropsWithChildrenAndClassName {
    name: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    label: 'cursor-pointer block',
    input: 'sr-only [&:focus-visible+*]:focused',
};

export const CheckBox: FC<CheckBox> = ({
    className = '',
    name,
    label,
    checked,
    onChange,
    children,
}) => {
    const id = useId();

    return (
        <>
            <input 
                className={styles.input}
                type='checkbox' 
                name={name}
                checked={checked}
                aria-label={label}
                id={id}
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