import { FC, RefObject, useId } from 'react';
import { conditional, twClassNames } from '@utils';



export interface TextInput {
    className?: string;
    id?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    minLength?: number;
    maxLength?: number;
    inputMode?: 'text' | 'email';
    label?: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    autoComplete?: boolean;
    spellCheck?: boolean;
    error?: string;
    value?: string;
    inputRef?: RefObject<HTMLInputElement>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    input: 'h-10 flex-1 w-full p-2 text-color-base bg-primary-500 rounded',
    error: 'sr-only',
};

export const TextInput: FC<TextInput> = ({ 
    className = '', 
    id,
    name,
    placeholder = '',
    type = 'text',
    minLength = 0,
    maxLength = 32, 
    inputMode = 'text',
    label,
    required = false,
    readOnly = false,
    disabled = false,
    autoComplete = false,
    spellCheck = false,
    error,
    value,
    inputRef,
    onChange,
}) => {
    const errorId = useId();
    const autoCompleteValue = conditional('on', 'off', autoComplete);

    return (
        <>
            <input
                className={twClassNames(styles.input, className)}
                name={name}
                id={id}
                type={type}
                placeholder={placeholder}
                minLength={minLength}
                maxLength={maxLength}
                spellCheck={spellCheck}
                inputMode={inputMode}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                autoComplete={autoCompleteValue}
                value={value}
                aria-label={label}
                aria-invalid={!!error}
                aria-describedby={errorId}
                ref={inputRef}
                onChange={onChange}
            />

            <span
                className={styles.error}
                id={errorId}
                aria-live='assertive'
            >
                {error}
            </span>
        </>
    );
};