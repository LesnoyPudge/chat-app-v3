import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    heading: 'mb-1.5 px-2.5 text-xs text-color-muted font-bold uppercase truncated',
};

export const NavigationHeading: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(styles.heading, className)}>
            {children}
        </div>
    );
};