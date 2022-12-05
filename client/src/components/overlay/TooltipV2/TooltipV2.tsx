import { FC, useContext, useState } from 'react';
import { OverlayPortal, Conditional, RelativelyPositioned, RefContextV2 } from '@components';
import { animated, to, useTransition, UseTransitionProps } from '@react-spring/web';
import { useEventListener } from 'usehooks-ts';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';



interface TooltipV2 extends PropsWithChildrenAndClassName {
    preferredAligment: 'top' | 'left' | 'bottom' | 'right';
}

const transitionProps: UseTransitionProps = {
    from: {
        opacity: 0,
        offset: 15,
    },
    enter: {
        opacity: 1,
        offset: 0,
    },
    leave: {
        opacity: 0,
        offset: 15,
    },
    config: {
        duration: 150,
    },
};

const baseClassName = `bg-primary-500 text-ellipsis text-normal font-bold 
py-[5px] px-2.5 rounded-md w-max max-w-[300px]`;

export const TooltipV2: FC<TooltipV2> = ({
    className,
    preferredAligment,
    children,
}) => {
    const { targetRef } = useContext(RefContextV2) as RefContextV2;
    const [isExist, setIsExist] = useState(false);
    const transition = useTransition(isExist, transitionProps);

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

    return transition((style, isRendered) => (
        <Conditional isRendered={isRendered}>
            <OverlayPortal>
                <div className='overlay-item-wrapper'>
                    <RelativelyPositioned
                        preferredAligment={preferredAligment} 
                        targetRefOrRect={targetRef}
                        boundsSize={20}
                        spacing={20}
                        swapableAligment
                        centered
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
                                >
                                    {children}
                                </animated.div>
                            );
                        }}
                    </RelativelyPositioned>
                </div>
            </OverlayPortal>
        </Conditional>
    ));
};