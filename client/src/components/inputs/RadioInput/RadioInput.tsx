import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useId } from 'react';



interface RadioInput extends PropsWithChildrenAndClassName {
    name: string;
    label: string;
    checked: boolean;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    label: {
        base: `cursor-pointer block min-h-[47px] flex items-center gap-3.5 p-2.5 rounded-md
        text-secondary bg-primary-300 hover:text-primary hover:bg-primary-100`,
        active: 'text-primary bg-primary-100', 
    },
    input: 'sr-only [&:focus-visible+*]:focused peer',
};

export const RadioInput: FC<RadioInput> = ({
    className = '',
    name,
    label,
    checked,
    value,
    children,
    onChange,
}) => {
    const id = useId();

    return (
        <>
            <input 
                className={styles.input}
                type='radio' 
                name={name}
                value={value}
                checked={checked}
                aria-label={label}
                id={id}
                onChange={onChange}
            />

            <label 
                className={twClassNames(
                    styles.label.base, 
                    { [styles.label.active]: checked },
                    className,
                )}
                htmlFor={id}
            >
                {children}
            </label>
        </>
    );
};