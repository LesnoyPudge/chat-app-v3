import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    base: 'text-color-secondary text-sm',
};

export const SettingsDescription: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <p className={twClassNames(styles.base, className)}>
            {children}
        </p>
    );
};