import { HeadingLevel } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = `flex flex-col justify-between min-h-[200px] 
max-h-[calc(100vh-40px)] w-[440px] shadow-elevation-high 
bg-primary-200 rounded`;

export const ModalContainer: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <HeadingLevel>
            <div className={twClassNames(baseClassName, className)}>
                {children}
            </div>
        </HeadingLevel>
    );
};