import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = 'text-secondary text-center';

export const ModalSubtitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(baseClassName, className)}>
            {children}
        </div>
    );
};