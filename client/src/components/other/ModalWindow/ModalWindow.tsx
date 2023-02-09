import { animated, UseTransitionProps } from '@react-spring/web';
import { FC, useContext } from 'react';
import { AnimatedTransition, ChildrenAsNodeOrFunction, Conditional, OverlayContext, OverlayItem } from '@components';
import { getTransitionOptions, twClassNames } from '@utils';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



interface ModalWindow extends PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    withBackdrop?: boolean;
    transitionOptions?: UseTransitionProps;
    label: string;
}

const defaultTransitionOptions = getTransitionOptions.defaultModal({});

const styles = {
    wrapper: `grid place-items-center fixed w-screen 
    h-screen pointer-events-none`,
    backdrop: `fixed top-0 left-0 w-screen h-screen bg-black 
    focus-hidden opacity-70 -z-10 scale-[999]`,
};

export const ModalWindow: FC<ModalWindow> = ({
    withBackdrop = false,
    transitionOptions = defaultTransitionOptions,
    label,
    children,
}) => {
    const overlayValues = useContext(OverlayContext) as OverlayContext;
    const { closeOverlay, isOverlayExist } = overlayValues;

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
                        className={twClassNames(
                            styles.wrapper,
                            { 'pointer-events-auto': isOverlayExist },
                        )}
                        style={style}
                        role='dialog'
                        aria-label={label}
                    >
                        <Conditional isRendered={withBackdrop}>
                            <div
                                className={twClassNames(styles.backdrop,
                                    { 'pointer-events-auto': isOverlayExist },
                                )}
                                onClick={closeOverlay}
                            ></div>
                        </Conditional>
                        
                        <ChildrenAsNodeOrFunction args={overlayValues}>
                            {children}
                        </ChildrenAsNodeOrFunction>
                    </animated.div>
                </OverlayItem>
            )}   
        </AnimatedTransition>
    );
};