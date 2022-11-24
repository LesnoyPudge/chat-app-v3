import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseCN = 'text-xs uppercase mb-2 text-secondary';

export const SettingsGroupTitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <Heading className={twClassNames(baseCN, className)}>
            {children}
        </Heading>
    );
};