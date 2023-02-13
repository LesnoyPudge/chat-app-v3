import { FC, useContext, useState } from 'react';
import { AnimatedTransition, ChildrenAsNodeOrFunction, OverlayContext, OverlayContextProvider, OverlayItem, RefContext, RelativelyPositioned } from '@components';
import { animated } from '@react-spring/web';
import { Alignment, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';
import { useEventListener } from 'usehooks-ts';




type TargetRect = Omit<DOMRect, 'x' | 'y' | 'toJSON'>

interface ContextMenu extends 
PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    preferredAlignment: Alignment;
}

const transitionOptions = getTransitionOptions.defaultContextMenu({});

const baseClassName = 'pointer-events-auto bg-primary-500 rounded text-color-base p-5';

const ContextMenuInner: FC<ContextMenu> = ({
    className = '',
    preferredAlignment,
    children,
}) => {
    const contextValues = useContext(OverlayContext) as OverlayContext;
    const { targetRef } = useContext(RefContext) as RefContext;
    const [targetRect, setTargetRect] = useState<TargetRect>();

    const handleContextMenu = (e: MouseEvent) => {
        const { closingThrottle, openOverlay } = contextValues;
        
        if (closingThrottle) return;

        const withMouse = e.button !== -1;
        const withKeyboard = !withMouse;
    
        if (withMouse) {
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
        }

        if (withKeyboard) {
            const target = e.currentTarget as HTMLElement;
            setTargetRect(target.getBoundingClientRect());
        }

        openOverlay();
    };

    useEventListener('contextmenu', handleContextMenu, targetRef);

    return (
        <AnimatedTransition 
            isExist={contextValues.isOverlayExist}
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
                        preferredAlignment={preferredAlignment}
                        targetRefOrRect={targetRect}
                        spacing={15}
                        boundsSize={20}
                        swapableAlignment
                    >
                        <animated.div 
                            className={twClassNames(baseClassName, className)}
                            style={style}
                            role='menu'
                        >
                            <ChildrenAsNodeOrFunction args={contextValues}>
                                {children}
                            </ChildrenAsNodeOrFunction>
                        </animated.div>
                    </RelativelyPositioned>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};

export const ContextMenu: FC<ContextMenu> = (props) => {
    return (
        <OverlayContextProvider>
            <ContextMenuInner {...props}/>
        </OverlayContextProvider>
    );
};