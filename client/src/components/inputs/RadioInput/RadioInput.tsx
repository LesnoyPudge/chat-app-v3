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
        base: `cursor-pointer min-h-[47px] flex items-center gap-3.5 p-2.5 rounded-md
        text-secondary bg-primary-300 hover:text-primary hover:bg-primary-100 focus-within:focused`,
        active: 'text-primary bg-primary-100', 
    },
    input: 'sr-only',
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
    return (
        <>
            <label 
                className={twClassNames(
                    styles.label.base, 
                    { [styles.label.active]: checked },
                    className,
                )}
            >
                <input 
                    className={styles.input}
                    type='radio' 
                    name={name}
                    value={value}
                    checked={checked}
                    aria-label={label}
                    onChange={onChange}
                />

                {children}
            </label>
        </>
    );
};