import { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { animated, useTransition, UseTransitionProps } from '@react-spring/web';
import ReactFocusLock from 'react-focus-lock';
import { IModalContext, ModalContext } from '@components';



interface IModal extends PropsWithChildren {
    withoutBackdrop?: boolean;
    animationProps?: UseTransitionProps;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

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

    const modal = transition((style, item) => (
        item &&
        <ReactFocusLock autoFocus={false} returnFocus>
            <animated.div
                className='flex items-center justify-center fixed w-screen 
                h-screen top-0 left-0 p-5 md:p-0 pointer-events-auto overflow-hidden'
                style={{
                    opacity: style.opacity,
                }}
                role='dialog'
            >
                {
                    !withoutBackdrop &&
                    <div 
                        className='fixed -z-[1] top-0 left-0 w-screen h-screen 
                        bg-black opacity-70'
                        onClick={closeModal}
                        onContextMenu={closeModal}
                        onAuxClick={closeModal}
                    ></div>
                }

                {children}
            </animated.div>
        </ReactFocusLock>
    ));

    return createPortal(modal, modalRoot);
};