import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { animated, useTransition, UseTransitionProps } from '@react-spring/web';
import ReactFocusLock from 'react-focus-lock';
import { Conditional, IModalContext, ModalContext, OverlayLayer } from '@components';



interface IModal extends PropsWithChildren {
    withoutBackdrop?: boolean;
    animationProps?: UseTransitionProps;
}

const styles = {
    wrapper: `flex items-center justify-center fixed w-screen 
    h-screen top-0 left-0 p-5 md:p-0 pointer-events-auto overflow-hidden`,
    backdrop: 'fixed -z-[1] top-0 left-0 w-screen h-screen bg-black opacity-70',
};

export const Modal: FC<IModal> = ({
    withoutBackdrop = false,
    animationProps = {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    },
    children,
}) => {
    const { isOpen, closeModal } = useContext(ModalContext) as IModalContext;
    const transition = useTransition(isOpen, animationProps);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => (e.code === 'Escape') && closeModal();
        
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [closeModal, isOpen]);

    return transition((style, item) => (
        <OverlayLayer>
            <Conditional isRendered={item}>
                <ReactFocusLock autoFocus={false} returnFocus>
                    <animated.div
                        className={styles.wrapper}
                        style={style}
                        role='dialog'
                    >
                        <Conditional isRendered={!withoutBackdrop}>
                            <div 
                                className={styles.backdrop}
                                onClick={closeModal}
                                onContextMenu={closeModal}
                                onAuxClick={closeModal}
                            ></div>
                        </Conditional>
                        
                        {children}
                    </animated.div>
                </ReactFocusLock>
            </Conditional>
        </OverlayLayer>
    ));
};