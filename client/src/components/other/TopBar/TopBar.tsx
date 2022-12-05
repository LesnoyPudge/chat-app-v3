import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface ITopBar extends PropsWithChildren {
    className?: string;
}

const baseClassName = 'flex shrink-0 items-center h-12';

export const TopBar: FC<ITopBar> = ({ children, className = '' }) => {
    return (
        <div className={twClassNames(baseClassName, className, 'shadow-elevation-low')}>
            {children}
        </div>
    );
};