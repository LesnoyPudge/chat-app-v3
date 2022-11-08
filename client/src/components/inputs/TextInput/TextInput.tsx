import { useField } from 'formik';
import { FC, useId, useState } from 'react';
import { Button, Conditional, Icon } from '@components';
import { twMerge } from 'tailwind-merge';
import { twClassNames } from '@utils';



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
    const isError = !!(meta.error && meta.touched);
    
    const handleTypeToggle = () => {
        setTypeState(prev => prev === 'password' ? 'text' : 'password');
    };
    
    return (
        <>
            <div className={twMerge(`flex flex-col gap-2 w-full ${className}`)}>
                <label 
                    htmlFor={id} 
                    className={twClassNames(
                        'text-xs w-full text-secondary',
                        { 'text-error': isError },
                    )}
                >
                    <span className='uppercase'>
                        {label}
                    </span>
                    
                    <Conditional isRendered={isRequired}>
                        <span className='ml-1 mr-1 text-required'>
                            *
                        </span>
                    </Conditional>

                    <Conditional isRendered={isError}>
                        <> &#8722; {meta.error}</>
                    </Conditional>
                </label>

                <div className='bg-primary-500 w-full rounded flex'>
                    <input 
                        {...field}
                        id={id}
                        className='w-full p-2 text-normal'
                        type={typeState} 
                        placeholder={placeholder}
                        maxLength={maxLength}
                        spellCheck={false}
                        inputMode={inputMode}
                        required={isRequired}
                    />

                    <Conditional isRendered={type === 'password'}>
                        <Button
                            onClick={handleTypeToggle}
                            className='px-2 group'
                        >
                            <Conditional isRendered={typeState === 'text'}>
                                <Icon 
                                    iconId='password-eye-on'
                                    className='h-[30px] fill-icon-100 group-hover:fill-icon-200'
                                />
                            </Conditional>
                        
                            <Conditional isRendered={typeState === 'password'}>
                                <Icon 
                                    iconId='password-eye-off'
                                    className='h-[30px] fill-icon-100 group-hover:fill-icon-200'
                                />
                            </Conditional>
                        </Button>
                    </Conditional>
                </div>
            </div>
        </>
    );
};