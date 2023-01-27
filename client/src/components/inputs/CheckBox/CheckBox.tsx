import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useId, useRef } from 'react';



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
    const inputRef = useRef<HTMLInputElement | null>(null);
    const id = useId();

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.code !== 'Enter') return;

        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <>
            <input 
                className={styles.input}
                type='checkbox' 
                name={name}
                checked={checked}
                aria-label={label}
                id={id}
                ref={inputRef}
                onChange={onChange}
                onKeyDown={handleEnter}
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