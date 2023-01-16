import { FC, ReactNode, useId, useState } from 'react';
import { Button, Conditional, Icon } from '@components';
import { conditional, twClassNames } from '@utils';



export interface TextInput {
    className?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    maxLength?: number;
    inputMode?: 'text' | 'email';
    label?: string;
    error?: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    autoComplete?: boolean;
    value?: string;
    before?: ReactNode;
    after?: ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
    wrapper: 'flex flex-col gap-2 w-full',
    label: {
        base: 'text-xs w-full text-secondary',
        error: 'text-error',
    },
    labelText: 'uppercase font-bold',
    required: 'ml-1 mr-1 text-required',
    inputWrapper: 'flex h-10 w-full bg-primary-500 rounded',
    input: 'w-full p-2 text-normal',
    typeToggleButton: 'aspect-square p-2 fill-icon-300 hover:fill-icon-100 focus-visible:fill-icon-100',
    typeToggleIcon: 'h-full w-full',
};

export const TextInput: FC<TextInput> = ({ 
    className = '', 
    name,
    placeholder = '',
    type = 'text', 
    maxLength = 32, 
    inputMode = 'text',
    label,
    error,
    required = false,
    readOnly = false,
    disabled = false,
    autoComplete = false,
    value,
    before,
    after,
    onChange,
}) => {
    const [typeState, setTypeState] = useState(type);
    const id = useId();

    const handleTypeToggle = () => {
        const isPassword = typeState === 'password';
        const newState = conditional('text', 'password', isPassword);
        setTypeState(newState);
    };

    const iconId = conditional('password-eye-on', 'password-eye-off', typeState === 'password');
    const autoCompleteValue = conditional('on', 'off', autoComplete);

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <Conditional isRendered={!!label || !!error}>
                <label 
                    className={twClassNames(
                        styles.label.base, 
                        { [styles.label.error]: !!error },
                    )}
                    htmlFor={id}
                >
                    <span className={styles.labelText}>
                        {label}
                    </span>
                    
                    <Conditional isRendered={required}>
                        <span className={styles.required}>
                            *
                        </span>
                    </Conditional>

                    <Conditional isRendered={!!error}>
                        <> &#8722; {error}</>
                    </Conditional>
                </label>
            </Conditional>

            <div className={styles.inputWrapper}>
                {before}

                <input
                    className={styles.input}
                    name={name}
                    id={id}
                    type={typeState}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    spellCheck={false}
                    inputMode={inputMode}
                    required={required}
                    readOnly={readOnly}
                    disabled={disabled}
                    autoComplete={autoCompleteValue}
                    value={value}
                    onChange={onChange}
                />

                {after}

                <Conditional isRendered={type === 'password'}>
                    <Button
                        onLeftClick={handleTypeToggle}
                        className={styles.typeToggleButton}
                    >
                        <Icon 
                            iconId={iconId}
                            className={styles.typeToggleIcon}
                        />
                    </Button>
                </Conditional>
            </div>
        </div>
    );
};