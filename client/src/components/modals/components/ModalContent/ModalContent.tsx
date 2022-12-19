import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = 'flex flex-col pb-4 px-4';

export const ModalContent: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(baseClassName, className)}>
            {children}
        </div>
    );
};