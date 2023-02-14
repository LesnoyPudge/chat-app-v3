import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = `flex flex-col justify-between 
max-h-[calc(100vh-40px)] w-[min(440px,calc(100vw-40px))] shadow-elevation-high 
bg-primary-200 rounded`;

export const ModalContainer: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(baseClassName, className)}>
            {children}
        </div>
    );
};