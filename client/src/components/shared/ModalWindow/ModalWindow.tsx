import { animated, UseTransitionProps } from '@react-spring/web';
import { FC, useContext } from 'react';
import { AnimatedTransition, ChildrenAsNodeOrFunction, Conditional, OverlayContext, OverlayItem } from '@components';
import { getTransitionOptions, twClassNames } from '@utils';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



interface ModalWindow extends PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    label: string;
    withBackdrop?: boolean;
    transitionOptions?: UseTransitionProps;
    noPointerEvents?: boolean;
}

const defaultTransitionOptions = getTransitionOptions.defaultModal();

const styles = {
    wrapper: 'fixed inset-0 pointer-events-none',
    inner: 'h-full relative isolate',
    backdrop: 'absolute inset-0 z-0 bg-black focus-hidden opacity-70 scale-[999]',
    contentWrapper: 'absolute inset-0 z-10 grid place-items-center',
    contentScrollable: 'overflow-x-hidden overflow-y-scroll scrollbar-hidden max-h-full',
};

export const ModalWindow: FC<ModalWindow> = ({
    label,
    withBackdrop = false,
    transitionOptions = defaultTransitionOptions,
    noPointerEvents = false,
    children,
}) => {
    const overlayValues = useContext(OverlayContext) as OverlayContext;
    const { closeOverlay, isOverlayExist } = overlayValues;

    // const withPointerEvents = isOverlayExist && !noPointerEvents;
    const pointerClass = noPointerEvents ? 'pointer-events-none' : 'pointer-events-auto';

    return (
        <AnimatedTransition
            isExist={isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ style, isAnimatedExist }) => (
                <OverlayItem
                    isRendered={isAnimatedExist}
                    blockable
                    blocking
                    closeOnEscape
                    closeOnClickOutside
                    focused
                >
                    <animated.div
                        className={styles.wrapper}
                        style={style}
                        role='dialog'
                        aria-label={label}
                    >
                        <div className={styles.inner}>
                            <Conditional isRendered={withBackdrop}>
                                <div
                                    className={twClassNames(
                                        styles.backdrop,
                                        pointerClass,
                                    )}
                                    onClick={closeOverlay}
                                ></div>
                            </Conditional>

                            <div className={styles.contentWrapper}>
                                <div className={twClassNames(
                                    styles.contentScrollable,
                                    pointerClass,
                                )}>
                                    <ChildrenAsNodeOrFunction args={overlayValues}>
                                        {children}
                                    </ChildrenAsNodeOrFunction>
                                </div>
                            </div>
                        </div>
                    </animated.div>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};