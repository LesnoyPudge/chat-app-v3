import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { IRefContext, RefContext } from '@components';
import { animated, useTransition } from '@react-spring/web';
import ReactFocusLock from 'react-focus-lock';



type UnmountType = (e?: Event | React.UIEvent) => void;

interface ContextMenuChildrenProps {
    unmount: UnmountType;
}

interface IContextMenu {
    children: (args: ContextMenuChildrenProps) => JSX.Element;
    handleRightClick?: boolean;
    handleLeftClick?: boolean;
    handleMiddleClick?: boolean;
}

export const ContextMenu: FC<IContextMenu> = ({ 
    children,
    handleRightClick = true,
    handleLeftClick = false,
    handleMiddleClick = false,
}) => {
    const { container, target } = useContext(RefContext) as IRefContext;
    const [isExist, setIsExist] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement | null>(null);
    const transition = useTransition(isExist, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    });

    const mount = useCallback((e: MouseEvent | KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e instanceof MouseEvent) setMenuPosition({ x: e.clientX, y: e.clientY });
        if (e instanceof KeyboardEvent) setMenuPosition({ x: -1, y: -1 });

        setIsExist(true);
    }, []);

    const unmount: UnmountType = useCallback((e) => {
        e && e.preventDefault();
        if (isExist) setIsExist(false);
    }, [isExist]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
        if (!isExist) return;
        if (e.code !== 'Escape') return;
        unmount(e);
    }, [isExist, unmount]);

    useEffect(() => {
        if (!container.current) return;
        const target = container.current;

        const onRightClick = (e: MouseEvent) => {
            if (!handleRightClick) return;
            mount(e);
        };
    
        const onLeftClick = (e: MouseEvent) => {
            if (e.button !== 0) return;
            if (!handleLeftClick) return;
            mount(e);
        };
    
        const onMiddleClick = (e: MouseEvent) => {
            if (e.button !== 1) return;
            if (!handleMiddleClick) return;
            mount(e);
        };

        const onEnter = (e: KeyboardEvent) => {
            if (!handleLeftClick) return;
            if (e.code !== 'Enter') return;
            mount(e);
        };

        target.addEventListener('click', onLeftClick);
        target.addEventListener('contextmenu', onRightClick);
        target.addEventListener('auxclick', onMiddleClick);
        target.addEventListener('keydown', onEnter);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            target.removeEventListener('click', onLeftClick);
            target.removeEventListener('contextmenu', onRightClick);
            target.removeEventListener('auxclick', onMiddleClick);
            target.removeEventListener('keydown', onEnter);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [container, handleKeyDown, handleLeftClick, handleMiddleClick, handleRightClick, mount]);

    useEffect(() => {
        if (!isExist) return;
        if (!contextMenuRef.current) return;
        if (!target.current) return;
        
        const menu = contextMenuRef.current;
        const targetElem = target.current;
        const spacing = 20;
        const withKeyboard = menuPosition.x === -1 || menuPosition.y === -1;
        const bounds = {
            top: spacing,
            right: window.innerWidth - menu.clientWidth - spacing,
            bottom: window.innerHeight - menu.clientHeight - spacing,
            left: spacing,
        };

        if (withKeyboard) {
            const targetCenter = {
                x: targetElem.offsetLeft + (targetElem.clientHeight / 2),
                y: targetElem.offsetTop + (targetElem.clientWidth / 2),
            };
            
            const position = {
                x: Math.max(bounds.left, Math.min(targetCenter.x, bounds.right)),
                y: Math.max(bounds.top, Math.min(targetCenter.y, bounds.bottom)),
            };

            setMenuPosition(position);
        }

        if (!withKeyboard) {
            const position = {
                x: Math.max(bounds.left, Math.min(menuPosition.x, bounds.right)),
                y: Math.max(bounds.top, Math.min(menuPosition.y, bounds.bottom)),
            };

            setMenuPosition(position);
        }

    }, [isExist, menuPosition.x, menuPosition.y, target]);

    const contextMenu = () => {
        return transition((style, item) => (
            item &&
            <>
                <ReactFocusLock autoFocus={false} returnFocus>
                    <div 
                        className='fixed top-0 left-0 w-screen h-screen pointer-events-auto'
                        onClick={unmount}
                        onContextMenu={unmount}
                        onAuxClick={unmount}
                        // onKeyDown={handleKeyDown}
                    ></div>

                
                    <animated.div
                        className='fixed pointer-events-auto bg-primary-500 rounded text-normal p-5'
                        style={{ 
                            opacity: style.opacity,
                            left: menuPosition.x + 15,
                            top: menuPosition.y,
                        }}
                        ref={contextMenuRef}
                        // onKeyDown={handleKeyDown}
                    >
                        {children({ unmount })}
                    </animated.div>
                </ReactFocusLock>
            </>
        ));
    };

    return ReactDOM.createPortal(contextMenu(), document.getElementById('modal-root') as HTMLElement);
};