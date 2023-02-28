import { FC, PropsWithChildren } from 'react';
import { twJoin } from 'tailwind-merge';



const styles = {
    wrapper: {
        base: 'grid gap-1',
        two: 'grid-cols-2',
        three: 'grid-cols-3',
    },
};

export const OneItem: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.wrapper.base}>
            {children}
        </div>
    );
};

export const TwoItems: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={twJoin(styles.wrapper.base, styles.wrapper.two)}>
            {children}
        </div>
    );
};

export const ThreeItems: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={twJoin(styles.wrapper.base, styles.wrapper.three)}>
            {children}
        </div>
    );
};