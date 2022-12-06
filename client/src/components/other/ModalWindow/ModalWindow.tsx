import { animated, UseTransitionProps } from '@react-spring/web';
import { FC, PropsWithChildren, useContext } from 'react';
import { AnimatedTransition, Conditional, OverlayContext, OverlayItem } from '@components';
import { twClassNames } from '@utils';



interface ModalWindow extends PropsWithChildren {
    withBackdrop?: boolean;
    transitionOptions?: UseTransitionProps;
}

const defaultTransitionOptions: UseTransitionProps = {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.9 },
};

const styles = {
    wrapper: `grid place-items-center fixed w-screen 
    h-screen pointer-events-none`,
    backdrop: `fixed top-0 left-0 w-screen 
    h-screen bg-black opacity-70 -z-10 scale-[999]`,
};

export const ModalWindow: FC<ModalWindow> = ({
    withBackdrop = false,
    transitionOptions = defaultTransitionOptions,
    children,
}) => {
    const { closeOverlay, isOverlayExist } = useContext(OverlayContext) as OverlayContext;

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
                            <div 
                                className={twClassNames(styles.backdrop,
                                    { 'pointer-events-auto': isOverlayExist },
                                )}
                                onClick={closeOverlay}
                                onContextMenu={closeOverlay}
                                onAuxClick={closeOverlay}
                            ></div>
                        </Conditional>
                        
                        <div 
                            className={twClassNames({ 
                                'pointer-events-auto': isOverlayExist, 
                            })}
                        >
                            {children}
                        </div>
                    </animated.div>
                </OverlayItem>
            )}   
        </AnimatedTransition>
    );
};