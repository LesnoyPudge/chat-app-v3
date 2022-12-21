import { FC, useContext, useState } from 'react';
import { OverlayPortal, Conditional, RelativelyPositioned, RefContext, AnimatedTransition } from '@components';
import { animated, to } from '@react-spring/web';
import { useEventListener } from 'usehooks-ts';
import { Aligment, PropsWithChildrenAndClassName } from '@types';
import { getTransitionOptions, twClassNames } from '@utils';



interface Tooltip extends PropsWithChildrenAndClassName {
    preferredAligment: Aligment;
    boundsSize?: number;
    spacing?: number;
    dependencyList?: unknown[];
}

const transitionOptions = getTransitionOptions.withOpacity({
    from: {
        offset: 15,
    },
    enter: {
        offset: 0,
    },
    leave: {
        offset: 15,
    },
    config: {
        duration: 150,
    },
});

const baseClassName = `bg-primary-500 text-normal font-bold 
py-[5px] px-2.5 rounded-md w-max max-w-[300px] shadow-elevation-low`;

export const Tooltip: FC<Tooltip> = ({
    className,
    preferredAligment,
    boundsSize = 20,
    spacing = 20,
    dependencyList,
    children,
}) => {
    const { targetRef } = useContext(RefContext) as RefContext;
    const [isExist, setIsExist] = useState(false);

    const open = () => setIsExist(true);
    const close = () => setIsExist(false);
    const handleFocusIn = (e: FocusEvent) => {
        if (e.target === targetRef.current) open();
    };
    const handleFocusOut = (e: FocusEvent) => {
        if (e.target === targetRef.current) close();
    };

    useEventListener('focusin', handleFocusIn, targetRef);
    useEventListener('focusout', handleFocusOut, targetRef);
    useEventListener('mouseenter', open, targetRef);
    useEventListener('mouseleave', close, targetRef);

    return (
        <AnimatedTransition
            isExist={isExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <Conditional isRendered={isAnimatedExist}>
                    <OverlayPortal>
                        <div className='overlay-item-wrapper'>
                            <RelativelyPositioned
                                preferredAligment={preferredAligment} 
                                targetRefOrRect={targetRef}
                                boundsSize={boundsSize}
                                spacing={spacing}
                                swapableAligment
                                centered
                                dependencyList={dependencyList}
                            >
                                {({ aligment }) => {
                                    const aligmentStyles = {
                                        top: {
                                            translateY: to([style.offset], (offset) => `-${offset}px`),
                                        },
                                        bottom: {
                                            translateY: to([style.offset], (offset) => `${offset}px`),
                                        },
                                        left: {
                                            translateX: to([style.offset], (offset) => `-${offset}px`),
                                        },
                                        right: {
                                            translateX: to([style.offset], (offset) => `${offset}px`),
                                        },
                                    };
    
                                    const styleWithOffset = {
                                        opacity: style.opacity,
                                        ...aligmentStyles[aligment],
                                    };
      
                                    return (
                                        <animated.div 
                                            className={twClassNames(baseClassName, className)}
                                            style={styleWithOffset}
                                            role='tooltip'
                                        >
                                            {children}
                                        </animated.div>
                                    );
                                }}
                            </RelativelyPositioned>
                        </div>
                    </OverlayPortal>
                </Conditional>
            )}
        </AnimatedTransition>
    );
};