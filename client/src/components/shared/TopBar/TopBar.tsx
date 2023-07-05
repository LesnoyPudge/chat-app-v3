import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface TopBar extends PropsWithChildren {
    className?: string;
}

const styles = {
    base: 'flex shrink-0 items-center h-12 shadow-elevation-low',
};

export const TopBar: FC<TopBar> = ({ children, className = '' }) => {
    return (
        <div className={twClassNames(styles.base, className)}>
            {children}
        </div>
    );
};