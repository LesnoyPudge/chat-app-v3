import { FC, useContext, useState } from 'react';
import { AnimatedTransition, OverlayContext, OverlayItem, RefContext, RelativelyPositioned } from '@components';
import { animated, UseTransitionProps } from '@react-spring/web';
import { Aligment, PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { useEventListener } from 'usehooks-ts';




type TargetRect = Omit<DOMRect, 'x' | 'y' | 'toJSON'>

interface ContextMenu extends PropsWithChildrenAndClassName {
    preferredAligment: Aligment;
    openOnLeftClick?: boolean;
    openOnRightClick?: boolean;
}

const transitionOptions: UseTransitionProps = {
    from: { opacity: 0, scale: 0.95 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.95 },
};

const baseClassName = 'pointer-events-auto bg-primary-500 rounded text-normal p-5';

export const ContextMenu: FC<ContextMenu> = ({
    className = '',
    preferredAligment,
    openOnLeftClick = false,
    openOnRightClick = false,
    children,
}) => {
    const { targetRef } = useContext(RefContext) as RefContext;
    const { isOverlayExist, closingThrottle, openOverlay } = useContext(OverlayContext) as OverlayContext;
    const [targetRect, setTargetRect] = useState<TargetRect>();

    const setCursorRect = (e: MouseEvent) => {
        const cursorSize = 1;
        
        const rect: TargetRect = {
            top: e.clientY,
            bottom: e.clientY + cursorSize,
            left: e.clientX,
            right: e.clientX + cursorSize,
            width: cursorSize,
            height: cursorSize,
        };

        setTargetRect(rect);
        openOverlay();
    };

    const setElementRect = () => {
        if (!targetRef.current) return;
        
        setTargetRect(targetRef.current.getBoundingClientRect());
        openOverlay();
    };

    const handleLeftClick = (e: MouseEvent | KeyboardEvent) => {
        if (closingThrottle) return;
        if (!openOnLeftClick) return;
        
        const withMouse = e instanceof MouseEvent;
        const withKeyboard = e instanceof KeyboardEvent;
        const spaceOrEnter = withKeyboard && (e.code === 'Enter' || e.code === 'Space');

        if (withMouse) {
            e.preventDefault();
            setCursorRect(e);
        }

        if (spaceOrEnter) {
            e.preventDefault();
            setElementRect();
        }
    };

    const handleRightClick = (e: MouseEvent) => {
        if (closingThrottle) return;
        if (!openOnRightClick) return;

        e.preventDefault();

        const withKeyboard = e.button === -1;
        const withMouse = e.button === 2;

        if (withKeyboard) setElementRect();
        if (withMouse) setCursorRect(e);
    };

    useEventListener('click', handleLeftClick, targetRef);
    useEventListener('keydown', handleLeftClick, targetRef);
    useEventListener('contextmenu', handleRightClick, targetRef);

    return (
        <AnimatedTransition 
            isExist={isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <OverlayItem 
                    isRendered={isAnimatedExist}
                    blockable
                    blocking
                    closeOnClickOutside
                    closeOnEscape
                    focused
                >
                    <RelativelyPositioned
                        preferredAligment={preferredAligment}
                        targetRefOrRect={targetRect}
                        spacing={15}
                        boundsSize={20}
                        swapableAligment
                    >
                        <animated.div 
                            className={twClassNames(baseClassName, className)}
                            style={style}
                            role='menu'
                        >
                            {children}
                        </animated.div>
                    </RelativelyPositioned>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};