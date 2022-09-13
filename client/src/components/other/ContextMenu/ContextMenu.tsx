import React, { FC, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { IRefContext, RefContext } from '@components';
import { animated, useTransition } from '@react-spring/web';



export const ContextMenu: FC<PropsWithChildren> = ({ children }) => {
    const { container } = useContext(RefContext) as IRefContext;
    const [isExist, setIsExist] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const transition = useTransition(isExist, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    });

    // const handleMount = useCallback((e: MouseEvent) => {
    //     e.preventDefault();
    //     !isExist && setMousePos({ x: e.clientX, y: e.clientY });
    //     setIsExist(true);
    // }, [isExist]);

    const handleUnmount = useCallback((e: Event | React.UIEvent) => {
        e.preventDefault();
        if (isExist) setIsExist(false);
    }, [isExist]);

    // const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    //     e.preventDefault();
    //     console.log(e.code);
    //     if (!isExist) return;
    //     if (e.code !== 'Escape') return;
        
    //     const modalRoot = document.getElementById('modal-root') as HTMLElement;
    //     if (modalRoot.lastElementChild !== contextMenuRef.current) return;
        
    //     setIsExist(false);
    // }, [isExist]);

    const handleToggle = useCallback((e: MouseEvent) => {
        e.preventDefault();
        
        !isExist && setMousePos({ x: e.clientX, y: e.clientY });
        setIsExist(prev => !prev);
    }, [isExist]);

    useEffect(() => {
        if (!container.current) return;
        const target = container.current;

        target.addEventListener('contextmenu', handleToggle);
        // document.addEventListener('keydown', handleKeyDown);
        // document.addEventListener('click', handleUnmount);
        // document.addEventListener('contextmenu', handleUnmount);
        
        return () => {
            target.removeEventListener('contextmenu', handleToggle);
            // document.removeEventListener('keydown', handleKeyDown);
            // document.removeEventListener('click', handleUnmount);
            // document.removeEventListener('contextmenu', handleUnmount);
        };
    }, [container, handleToggle]);

    const contextMenu = () => {
        return transition((style, item) => {
            return (
                item &&
                <>
                    <div 
                        className='fixed top-0 left-0 w-screen h-screen pointer-events-auto'
                        onClick={handleUnmount}
                        onContextMenu={handleUnmount}
                        // onKeyDown={handleKeyDown}
                        ref={contextMenuRef}
                    ></div>

                    <animated.div
                        className='fixed pointer-events-auto bg-primary-500 rounded text-normal p-5'
                        style={{ 
                            opacity: style.opacity,
                            left: mousePos.x + 15,
                            top: mousePos.y,
                        }}
                    >
                        {children}
                    </animated.div>
                </>
            );
        });
    };

    return ReactDOM.createPortal(contextMenu(), document.getElementById('modal-root') as HTMLElement);
};