import classNames from 'classnames';
import { useField } from 'formik';
import { FC, useState } from 'react';
import { Button, Flex, Icon } from '@components';



interface ITextInputProps {
    className?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    maxLength?: number;
}

export const TextInput: FC<ITextInputProps> = ({ 
    className = '', 
    name,
    placeholder = '',
    type = 'text', 
    maxLength = 32, 
}) => {
    const [field, meta] = useField(name);
    const [typeState, setTypeState] = useState(type);
    const inputWrapperCN = classNames({
        'bgc-primary-500': true,
        'w-full': true,
        'br-5': true,
        [className]: !!className,
    });

    const handleTypeToggle = () => {
        setTypeState(prev => prev === 'password' ? 'text' : 'password');
    };
    
    return (
        <>
            <Flex className={inputWrapperCN}>
                <input 
                    {...field}
                    id={name}
                    className='w-full p-10 fs-16 text-normal'
                    type={typeState} 
                    placeholder={placeholder}
                    maxLength={maxLength}
                    spellCheck={false}
                />

                {
                    type === 'password' &&
                    <Button
                        onClick={handleTypeToggle}
                        className='px-10'
                    >
                        {
                            typeState === 'text' 
                                ? <Icon iconId='password-eye-on' height={30} width={30}/>
                                : <Icon iconId='password-eye-off' height={30} width={30}/>
                        }
                        
                    </Button>
                }
            </Flex>
        </>
    );
};