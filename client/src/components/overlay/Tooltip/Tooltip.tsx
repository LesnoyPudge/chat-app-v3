import { AnimatedTransition, OverlayPortal, RelativelyPositioned } from '@components';
import { RelativePositionOptions, useEventListener, useRefWithSetter, useSharedIntersectionObserver, useFocusVisibleEvent } from '@hooks';
import { animated } from '@react-spring/web';
import { PropsWithChildrenAndClassName, PropsWithLeaderElementRef } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';
import { FC, useState } from 'react';



type Tooltip = (
    PropsWithChildrenAndClassName &
    PropsWithLeaderElementRef &
    RelativePositionOptions
);

const transitionOptions = getTransitionOptions.withOpacity({
    from: {
        offset: 15,
    },
    enter: {
        offset: 0,
    },
    leave: {
        offset: 15,
    },
    config: {
        duration: 150,
    },
});

const styles = {
    base: `bg-primary-500 text-color-base font-bold py-[5px] px-2.5 
    rounded-md w-max max-w-[300px] shadow-elevation-low`,
    overlayItem: 'overlay-item-wrapper',
};

export const Tooltip: FC<Tooltip> = ({
    className = '',
    leaderElementRef,
    children,
    preferredAlignment,
    boundsSize = 20,
    centered = true,
    spacing = 20,
    swappableAlignment = true,
    unbounded,
}) => {
    const [isExist, setIsExist] = useState(false);
    const [withKeyboardRef, setWithKeyboard] = useRefWithSetter(false);
    const [withMouseRef, setWithMouse] = useRefWithSetter(false);

    const changeState = () => {
        const newState = withKeyboardRef.current || withMouseRef.current;
        if (newState === isExist) return;

        setIsExist(newState);
    };

    const handleFocusIn = (e: FocusEvent) => {
        if (!leaderElementRef.current) return;
        if (e.target !== leaderElementRef.current) return;

        setWithKeyboard(true);
        changeState();
    };

    const handleFocusOut = (e: FocusEvent) => {
        if (!leaderElementRef.current) return;
        if (e.target !== leaderElementRef.current) return;

        setWithKeyboard(false);
        changeState();
    };

    const handleMouseEnter = () => {
        setWithMouse(true);
        changeState();
    };

    const handleMouseLeave = () => {
        setWithMouse(false);
        changeState();
    };

    useFocusVisibleEvent(handleFocusIn, handleFocusOut, leaderElementRef);
    useEventListener('mouseenter', handleMouseEnter, leaderElementRef);
    useEventListener('mouseleave', handleMouseLeave, leaderElementRef);

    useSharedIntersectionObserver(leaderElementRef, ({ isIntersecting }) => {
        if (isIntersecting === isExist) return;
        if (!withKeyboardRef.current && !withMouseRef.current) return;

        setIsExist(isIntersecting);
    });

    return (
        <AnimatedTransition
            isExist={isExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <If condition={isAnimatedExist}>
                    <OverlayPortal>
                        <div className={styles.overlayItem}>
                            <RelativelyPositioned
                                leaderElementOrRectRef={leaderElementRef}
                                preferredAlignment={preferredAlignment}
                                boundsSize={boundsSize}
                                centered={centered}
                                spacing={spacing}
                                swappableAlignment={swappableAlignment}
                                unbounded={unbounded}
                            >
                                {({ alignment }) => {
                                    const alignmentStyles = {
                                        top: {
                                            translateY: style.offset.to((offset => `-${offset}px`)),
                                        },
                                        bottom: {
                                            translateY: style.offset.to((offset) => `${offset}px`),
                                        },
                                        left: {
                                            translateX: style.offset.to((offset) => `-${offset}px`),
                                        },
                                        right: {
                                            translateX: style.offset.to((offset) => `${offset}px`),
                                        },
                                    };

                                    const styleWithOffset = {
                                        opacity: style.opacity,
                                        ...alignmentStyles[alignment],
                                    };

                                    return (
                                        <animated.div
                                            className={twClassNames(styles.base, className)}
                                            style={styleWithOffset}
                                            role='tooltip'
                                        >
                                            {children}
                                        </animated.div>
                                    );
                                }}
                            </RelativelyPositioned>
                        </div>
                    </OverlayPortal>
                </If>
            )}
        </AnimatedTransition>
    );
};