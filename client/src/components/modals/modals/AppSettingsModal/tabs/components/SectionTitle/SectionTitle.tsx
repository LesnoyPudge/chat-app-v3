import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseCN = 'text-primary text-xl mb-5';

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