import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const baseCN = 'text-secondary text-sm';

export const SettingsDescription: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <p className={twClassNames(baseCN, className)}>
            {children}
        </p>
    );
};