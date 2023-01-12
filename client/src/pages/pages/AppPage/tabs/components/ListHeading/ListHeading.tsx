import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = 'uppercase text-sm text-secondary flex gap-2 mb-3';

export const ListHeading: FC<PropsWithChildrenAndClassName> = ({
    className = '', 
    children,
}) => {
    return (
        <Heading className={twClassNames(baseClassName, className)}>
            {children}
        </Heading>
    );
};