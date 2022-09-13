import React, { PropsWithChildren, useEffect, useState , FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import { animated, useTransition, to } from '@react-spring/web';
import { IRefContext, RefContext } from '@components';



interface ITooltipProps extends PropsWithChildren {
    position: 'left' | 'right' | 'top' | 'bottom';
    spacing?: number;
    animationOffset?: number;
}

export const Tooltip: FC<ITooltipProps> = ({
    children, 
    position, 
    spacing = 5,
    animationOffset = 15,
}) => {
    const { container, target } = useContext(RefContext) as IRefContext;
    const [isExist, setIsExist] = useState(false);
    const transition = useTransition(isExist, {
        from: { opacity: 0, animationOffset },
        enter: { opacity: 1, animationOffset: 0 },
        leave: { opacity: 0, animationOffset },
    });

    useEffect(() => {
        if (!container.current) return;
        const containerElem = container.current;

        containerElem.addEventListener('mouseenter', handleMount);
        containerElem.addEventListener('mouseleave', handleUnmount);
        containerElem.addEventListener('focusin', handleMount);
        containerElem.addEventListener('focusout', handleUnmount);

        return () => {
            containerElem.removeEventListener('mouseenter', handleMount);
            containerElem.removeEventListener('mouseleave', handleUnmount);
            containerElem.removeEventListener('focusin', handleMount);
            containerElem.removeEventListener('focusout', handleUnmount);
        };
    }, [container]);

    const handleMount = () => {
        setIsExist(true);
    };

    const handleUnmount = () => {
        setIsExist(false);
    };

    const tooltip = () => {
        if (!target.current) return;

        const rect = target.current.getBoundingClientRect();
        
        return transition((style, item) => {
            const positions = {
                top: {
                    translateX: '-50%',
                    translateY: to([style.animationOffset], (animationOffset) => `calc(-100% - ${animationOffset}px)`),
                    top: `${rect.top - spacing}px`,
                    left: `${rect.left + rect.width / 2}px`,
                    tail: 'before:top-full before:absolute before:left-1/2 before:-translate-x-1/2 before:border-l-[5px] before:border-l-transparent before:border-r-[5px] before:border-r-transparent before:border-t-[5px] before:border-t-primary-500',
                },
                right: {
                    translateX: to([style.animationOffset], (animationOffset) => `${animationOffset}px`),
                    translateY: '-50%',
                    top: `${rect.top + rect.height / 2}px`,
                    left: `${rect.left + rect.width + spacing}px`,
                    tail: 'before:top-1/2 before:left-0 before:left-0 before:absolute before:-translate-y-1/2 before:-translate-x-full before:border-r-[5px] before:border-r-primary-500 before:border-t-[5px] before:border-t-transparent before:border-b-[5px] before:border-b-transparent',
                },
                bottom: {
                    translateX: '-50%',
                    translateY: to([style.animationOffset], (animationOffset) => `${animationOffset}px`),
                    top: `${rect.top + rect.height + spacing}px`,
                    left: `${rect.left + rect.width / 2}px`,
                    tail: 'before:top-0 before:left-1/2 before:absolute before:-translate-x-1/2 before:-translate-y-full before:border-l-[5px] before:border-l-transparent before:border-r-[5px] before:border-r-transparent before:border-b-[5px] before:border-b-primary-500',
                },
                left: {
                    translateX: to([style.animationOffset], (animationOffset) => `calc(-100% - ${animationOffset}px)`),
                    translateY: '-50%',
                    top: `${rect.top + rect.height / 2}px`,
                    left: `${rect.left - spacing}px`,
                    tail: 'before:top-1/2 before:left-full before:absolute before:-translate-y-1/2 before:border-l-[5px] before:border-l-primary-500 before:border-t-[5px] before:border-t-transparent before:border-b-[5px] before:border-b-transparent',
                },
            };

            return (
                item && <animated.div
                    className='fixed pointer-events-none overflow-hidden'
                    style={{ 
                        opacity: style.opacity,
                        translateX: positions[position].translateX,
                        translateY: positions[position].translateY,
                        left: positions[position].left,
                        top: positions[position].top,
                    }}
                >
                    <div 
                        className={`relative bg-primary-500 text-ellipsis text-normal font-bold 
                        py-[5px] px-2.5 rounded-md m-1.5 ${positions[position].tail}`}
                    >
                        {children}
                    </div>
                </animated.div>
            );
        });
    };

    return ReactDOM.createPortal(tooltip(), document.getElementById('modal-root') as HTMLElement);
};