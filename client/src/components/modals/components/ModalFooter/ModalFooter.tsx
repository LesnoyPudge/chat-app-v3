import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = 'flex items-center justify-end gap-2 p-4 bg-primary-300';

export const ModalFooter: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(baseClassName, className)}>
            {children}
        </div>
    );
};