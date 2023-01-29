import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseClassName = 'text-xs uppercase mb-2 text-color-secondary';

export const SettingsGroupTitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <Heading className={twClassNames(baseClassName, className)}>
            {children}
        </Heading>
    );
};