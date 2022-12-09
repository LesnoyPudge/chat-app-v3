import { useField } from 'formik';
import { FC, useId, useState } from 'react';
import { Button, Conditional, Icon } from '@components';
import { conditional, twClassNames } from '@utils';



interface ITextInputProps {
    className?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    maxLength?: number;
    inputMode?: 'text' | 'email';
    label: string;
    isRequired?: boolean;
}

const styles = {
    wrapper: 'flex flex-col gap-2 w-full',
    label: {
        base: 'text-xs w-full text-secondary',
        error: 'text-error',
    },
    labelText: 'uppercase',
    required: 'ml-1 mr-1 text-required',
    inputWrapper: 'bg-primary-500 w-full rounded flex',
    input: 'w-full p-2 text-normal',
    typeToggleButton: 'px-2 fill-icon-200 hover:fill-icon-300',
    typeToggleIcon: 'h-[30px]',
};

export const TextInput: FC<ITextInputProps> = ({ 
    className = '', 
    name,
    placeholder = '',
    type = 'text', 
    maxLength = 32, 
    inputMode = 'text',
    label,
    isRequired = false,
}) => {
    const [field, meta] = useField(name);
    const [typeState, setTypeState] = useState(type);
    const id = useId();

    const handleTypeToggle = () => {
        setTypeState(prev => prev === 'password' ? 'text' : 'password');
    };
    
    const isError = !!(meta.error && meta.touched);
    const iconId = conditional('password-eye-on', 'password-eye-off', typeState === 'password');

    return (
        <>
            <div className={twClassNames(styles.wrapper, className)}>
                <label 
                    htmlFor={id} 
                    className={twClassNames(
                        styles.label.base, 
                        { [styles.label.error]: isError },
                    )}
                >
                    <span className={styles.labelText}>
                        {label}
                    </span>
                    
                    <Conditional isRendered={isRequired}>
                        <span className={styles.required}>
                            *
                        </span>
                    </Conditional>

                    <Conditional isRendered={isError}>
                        <> &#8722; {meta.error}</>
                    </Conditional>
                </label>

                <div className={styles.inputWrapper}>
                    <input 
                        {...field}
                        id={id}
                        className={styles.input}
                        type={typeState} 
                        placeholder={placeholder}
                        maxLength={maxLength}
                        spellCheck={false}
                        inputMode={inputMode}
                        required={isRequired}
                    />

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
        </>
    );
};