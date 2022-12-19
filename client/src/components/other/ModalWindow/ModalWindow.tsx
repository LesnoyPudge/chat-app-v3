import { animated, easings, UseTransitionProps } from '@react-spring/web';
import { FC, useContext } from 'react';
import { AnimatedTransition, Button, ChildrenAsNodeOrFunction, Conditional, OverlayContext, OverlayContextProvider, OverlayItem, RefContext } from '@components';
import { twClassNames } from '@utils';
import { useEventListener } from 'usehooks-ts';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



interface ModalWindow extends PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    withBackdrop?: boolean;
    transitionOptions?: UseTransitionProps;
}

const defaultTransitionOptions: UseTransitionProps = {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    config: {
        duration: 350,
        easing: easings.easeOutBack,
    },
};

const styles = {
    wrapper: `grid place-items-center fixed w-screen 
    h-screen pointer-events-none`,
    backdrop: `fixed top-0 left-0 w-screen h-screen bg-black 
    focus-hidden opacity-70 -z-10 scale-[999]`,
};

const ModalWindowInner: FC<ModalWindow> = ({
    withBackdrop = false,
    transitionOptions = defaultTransitionOptions,
    children,
}) => {
    const overlayValues = useContext(OverlayContext) as OverlayContext;
    const { openOverlay, closeOverlay, isOverlayExist } = overlayValues;
    const { targetRef } = useContext(RefContext) as RefContext;

    const handleOpen = () => {  
        if (!targetRef.current) return;
        openOverlay();
    };
    
    useEventListener('click', handleOpen, targetRef);

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
                    >
                        <Conditional isRendered={withBackdrop}>
                            <Button
                                className={twClassNames(styles.backdrop,
                                    { 'pointer-events-auto': isOverlayExist },
                                )}
                                onAnyClick={closeOverlay}
                                label='Закрыть диалог'
                            ></Button>
                        </Conditional>
                        
                        <div 
                            className={twClassNames({ 
                                'pointer-events-auto': isOverlayExist, 
                            })}
                            role='dialog'
                        >
                            <ChildrenAsNodeOrFunction args={overlayValues}>
                                {children}
                            </ChildrenAsNodeOrFunction>
                        </div>
                    </animated.div>
                </OverlayItem>
            )}   
        </AnimatedTransition>
    );
};

export const ModalWindow: FC<ModalWindow> = (props) => {
    return (
        <OverlayContextProvider>
            <ModalWindowInner {...props}/>
        </OverlayContextProvider>
    );
};