import { PropsWithChildrenAndClassName, PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, PropsWithChildren } from 'react';



interface Scrollable extends PropsWithChildrenAndClassName {
    innerClassName?: string;
    scrollbarHidden?: boolean;
    scrollbarAutoHidden?: boolean;
    withGutter?: boolean;
    withGutters?: boolean;
}

const styles = {
    wrapper: 'flex-1 relative',
    inner: 'absolute inset-0 overflow-y-scroll scrollbar-primary',
    modifiers: {
        scrollbarHidden: 'scrollbar-hidden',
        scrollbarAutoHidden: 'scrollbar-auto-hidden',
        withGutter: 'scrollbar-with-gutter',
        withGutters: 'scrollbar-with-gutters',
    },
};

export const Scrollable: FC<Scrollable> = ({
    className = '',
    innerClassName = '',
    scrollbarAutoHidden = false,
    scrollbarHidden = false,
    withGutter = false,
    withGutters = false,
    children,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <div className={twClassNames(
                styles.inner,
                {
                    [styles.modifiers.scrollbarAutoHidden]: scrollbarAutoHidden,
                    [styles.modifiers.scrollbarHidden]: scrollbarHidden,
                    [styles.modifiers.withGutter]: withGutter,
                    [styles.modifiers.withGutters]: withGutters,
                },
                innerClassName,
            )}>
                {children}
            </div>
        </div>
    );
};


import SimpleBar, { Props } from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import { SimpleBarOptions } from 'simplebar-core';
import { useThrottle } from '@hooks';






interface ScrollableV2 extends PropsWithClassName,
PropsWithChildren {
    autoHide?: boolean;
    hidden?: boolean;
}

const styles2 = {
    wrapper: 'flex flex-1 scrollbar scrollbar-with-opposite-gutter',
    modifiers: {
        hidden: 'scrollbar-hidden',
        autoHide: 'scrollbar-auto-hide',
        isAlive: 'scrollbar-is-alive',
    },
};

export const ScrollableV2: FC<ScrollableV2> = ({
    className = '',
    autoHide = false,
    hidden = false,
    children,
}) => {
    const { throttle, isThrottling: isAlive } = useThrottle();  

    const handlePoinerMove = () => {
        if (!autoHide) return;
        
        throttle(() => {}, 3000)();
    };

    return (
        <SimpleBar 
            className={twClassNames(
                styles2.wrapper, 
                { 
                    [styles2.modifiers.hidden]: hidden,
                    [styles2.modifiers.autoHide]: autoHide,
                    [styles2.modifiers.isAlive]: isAlive, 
                },
                className,
            )}
            forceVisible
            autoHide={false}
            clickOnTrack
            onPointerMove={handlePoinerMove}
        >
            {children}
        </SimpleBar>
    );
};