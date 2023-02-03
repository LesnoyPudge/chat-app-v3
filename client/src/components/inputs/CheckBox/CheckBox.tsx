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
    label: 'block relative focus-within:focused',
    input: 'sr-input peer',
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

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.code !== 'Enter') return;

        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <>
            <label className={twClassNames(styles.label, className)}>
                <input 
                    className={styles.input}
                    type='checkbox' 
                    name={name}
                    checked={checked}
                    aria-label={label}
                    ref={inputRef}
                    onChange={onChange}
                    onKeyDown={handleEnter}
                />

                {children}
            </label>   
        </>
    );
};