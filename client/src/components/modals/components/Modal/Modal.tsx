import { FC, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { animated, useTransition, UseTransitionProps } from '@react-spring/web';
import ReactFocusLock from 'react-focus-lock';
import { Conditional, IModalContext, ModalContext, OverlayLayer } from '@components';
import { getHTML, twClassNames } from '@utils';



interface IModal extends PropsWithChildren {
    className?: string;
    withoutBackdrop?: boolean;
    animationProps?: UseTransitionProps;
}

const styles = {
    wrapper: 'fixed top-0 left-0 w-screen h-screen pointer-events-none',
    inner: `relative isolate grid place-items-center w-screen 
    h-screen p-5 md:p-0 overflow-hidden`,
    backdrop: `absolute -z-[1] top-0 left-0 w-screen 
    h-screen bg-black opacity-70 pointer-events-auto`,
};

const defaultAnimationProps = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 100 },
};

export const Modal: FC<IModal> = ({
    className = '',
    withoutBackdrop = false,
    animationProps = defaultAnimationProps,
    children,
}) => {
    const { isOpen, closeModal } = useContext(ModalContext) as IModalContext;
    const transition = useTransition(isOpen, animationProps);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (!wrapperRef.current) return;
            if (e.code !== 'Escape') return;
            if (getHTML().overlayLayer.lastElementChild !== wrapperRef.current) return;

            closeModal();
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [closeModal]);

    return transition((style, isRendered) => (
        <Conditional isRendered={isRendered}>
            <OverlayLayer>
                <div 
                    className={styles.wrapper}
                    ref={wrapperRef}
                >
                    <ReactFocusLock returnFocus>
                        <animated.div
                            className={twClassNames(styles.inner, className)}
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
                        
                            <div className='pointer-events-auto'>
                                {children}
                            </div>
                        </animated.div>
                    </ReactFocusLock>
                </div>
            </OverlayLayer>
        </Conditional>
    ));
};