import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface Scrollable extends PropsWithChildrenAndClassName {
    innerClassName?: string;
}

const styles = {
    wrapper: 'flex-1 relative',
    inner: 'absolute inset-0 overflow-y-scroll scrollbar-primary',
};

export const Scrollable: FC<Scrollable> = ({
    className = '',
    innerClassName = '',
    children,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <div className={twClassNames(styles.inner, innerClassName)}>
                {children}
            </div>
        </div>
    );
};