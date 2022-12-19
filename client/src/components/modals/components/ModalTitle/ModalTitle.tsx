import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = 'text-2xl font-bold text-primary text-center';

export const ModalTitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <Heading className={twClassNames(baseClassName, className)}>
            {children}
        </Heading>
    );
};