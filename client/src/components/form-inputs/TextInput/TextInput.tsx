import { useField } from 'formik';
import { FC, useId, useState } from 'react';
import { Button, Icon } from '@components';
import classNames from 'classnames';



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
    const isError = meta.error && meta.touched;
    const [typeState, setTypeState] = useState(type);
    const id = useId();
    const labelCN = classNames({
        'text-secondary': !isError,
        'text-error': isError,
        'text-xs': true,
        'w-full': true,
    });
    
    const handleTypeToggle = () => {
        setTypeState(prev => prev === 'password' ? 'text' : 'password');
    };
    
    return (
        <>
            <div className={`flex flex-col gap-2 w-full ${className}`}>
                <label htmlFor={id} className={labelCN}>
                    <span className='uppercase'>
                        {label}
                    </span>
                    
                    {isRequired && <span className='ml-1 mr-1 text-required'>*</span>}

                    {isError && <> &#8722; {meta.error}</>}
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

                    {
                        type === 'password' &&
                        <Button
                            onClick={handleTypeToggle}
                            className='px-2'
                        >
                            {
                                typeState === 'text' 
                                    ? <Icon iconId='password-eye-on' height={30} width={30}/>
                                    : <Icon iconId='password-eye-off' height={30} width={30}/>
                            }
                            
                        </Button>
                    }
                </div>
            </div>
        </>
    );
};