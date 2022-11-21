import { HeadingLevel } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { FC } from 'react';



export const SettingsGroup: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <HeadingLevel>
            <div className={className}>
                {children}
            </div>
        </HeadingLevel>
    );
};