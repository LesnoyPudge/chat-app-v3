import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseCN = 'text-primary font-semibold text-heading-l';

export const SectionTitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <Heading className={twClassNames(baseCN, className)}>
            {children}
        </Heading>
    );
};