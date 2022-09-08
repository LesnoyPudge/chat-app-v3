import classNames from 'classnames';
import { useField } from 'formik';
import { FC, PropsWithChildren } from 'react';
import { Flex } from '@components';



interface IFormField extends PropsWithChildren {
    className?: string;
    name: string;
    label?: string;
    isRequeired?: boolean;
}

export const FormField: FC<IFormField> = ({
    name,
    className = '',
    label,
    isRequeired = false,
    children,
}) => {
    const [field, meta] = useField(name);
    const isError = meta.error && meta.touched;
    const fieldCN = classNames({
        'w-full': true,
        [className]: !!className,
    });
    const labelCN = classNames({
        'text-secondary': !isError,
        'text-error': isError,
        'fs-12': true,
        'w-full': true,
    });

    return (
        <Flex 
            className={fieldCN}
            direction='column'
            gap={8}
        >
            <label htmlFor={name} className={labelCN}>
                <span className='uppercase'>
                    {label}
                </span>
                    
                {
                    isRequeired && 
                        <span className='ml-5 mr-5 text-required'>
                            *
                        </span>
                }

                {
                    isError && 
                        <>
                            &#8722; {meta.error}
                        </>
                }
            </label>

            {children}
        </Flex>
    );
};