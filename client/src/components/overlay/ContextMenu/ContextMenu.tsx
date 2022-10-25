import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IRefContext, OverlayLayer, RefContext } from '@components';
import { animated, useTransition } from '@react-spring/web';
import ReactFocusLock from 'react-focus-lock';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';



type UnmountType = (e?: Event | React.UIEvent) => void;

interface ContextMenuChildrenProps {
    unmount: UnmountType;
}

interface IContextMenu {
    className?: string;
    offset?: number;
    handleRightClick?: boolean;
    handleLeftClick?: boolean;
    handleMiddleClick?: boolean;
    children: (args: ContextMenuChildrenProps) => JSX.Element;
}

const baseClassName = 'fixed pointer-events-auto bg-primary-500 rounded text-normal p-5';

export const ContextMenu: FC<IContextMenu> = ({ 
    className = '',
    offset = 15,
    handleRightClick = true,
    handleLeftClick = false,
    handleMiddleClick = false,
    children,
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

    const setPositionInBounds = useCallback(({ clickPosX, clickPosY }: {clickPosX: number, clickPosY: number}) => {
        if (!contextMenuRef.current) return;
        if (!target.current) return;
        
        const menu = contextMenuRef.current;
        const targetElem = target.current;
        const spacing = 20;
        const withKeyboard = clickPosX === -1 || clickPosY === -1;
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

            return setMenuPosition(position);
        }

        if (!withKeyboard) {
            const position = {
                x: Math.max(bounds.left, Math.min(clickPosX, bounds.right)),
                y: Math.max(bounds.top, Math.min(clickPosY, bounds.bottom)),
            };

            return setMenuPosition(position);
        }
    }, [target]);

    const mount = useCallback((e: MouseEvent | KeyboardEvent) => {
        e.preventDefault();
        // e.stopPropagation();
        if (isExist && e instanceof MouseEvent) return setPositionInBounds({ clickPosX: e.clientX, clickPosY: e.clientY });

        if (e instanceof MouseEvent) setMenuPosition({ x: e.clientX, y: e.clientY });
        if (e instanceof KeyboardEvent) setMenuPosition({ x: -1, y: -1 });

        setIsExist(true);
    }, [isExist, setPositionInBounds]);

    const unmount: UnmountType = useCallback((e) => {
        e && e.preventDefault();
        if (isExist) setIsExist(false);
    }, [isExist]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
        if (!isExist) return;
        if (e.code === 'Escape') unmount(e);
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
        
        return () => {
            target.removeEventListener('click', onLeftClick);
            target.removeEventListener('contextmenu', onRightClick);
            target.removeEventListener('auxclick', onMiddleClick);
            target.removeEventListener('keydown', onEnter);
        };
    }, [container, handleKeyDown, handleLeftClick, handleMiddleClick, handleRightClick, mount]);

    useEffect(() => {
        if (isExist) return setPositionInBounds({ clickPosX: menuPosition.x, clickPosY: menuPosition.y });
    }, [isExist, menuPosition.x, menuPosition.y, setPositionInBounds]);

    useEffect(() => {
        if (!isExist) return;
        if (!contextMenuRef.current) return;
        if (!container.current) return;

        const menu = contextMenuRef.current;
        const containerElem = container.current;

        const handleUnmount = (e: MouseEvent) => {
            if (!e.target) return;
            const target = e.target as HTMLElement;

            if (containerElem === target || containerElem.contains(target)) return mount(e);
            if (menu !== target && !menu.contains(target)) return unmount();
        };

        document.addEventListener('click', handleUnmount);
        document.addEventListener('auxclick', handleUnmount);
        document.addEventListener('contextmenu', handleUnmount);

        return () => {
            document.removeEventListener('click', handleUnmount);
            document.removeEventListener('auxclick', handleUnmount);
            document.removeEventListener('contextmenu', handleUnmount);
        };
    }, [container, isExist, mount, unmount]);

    useEffect(() => {
        if (!isExist) return;
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown, isExist]);

    const contextMenu = transition((style, item) => (
        <OverlayLayer isRendered={item}>
            <ReactFocusLock autoFocus={false} returnFocus>
                <animated.div
                    className={twMerge(classNames(baseClassName, className))}
                    style={{ 
                        opacity: style.opacity,
                        left: menuPosition.x + offset,
                        top: menuPosition.y,
                    }}
                    ref={contextMenuRef}
                >
                    {children({ unmount })}
                </animated.div>
            </ReactFocusLock>
        </OverlayLayer>
    ));

    return contextMenu;
};