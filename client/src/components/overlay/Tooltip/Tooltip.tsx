import { PropsWithChildren, useEffect, useState , FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import { animated, useTransition, to } from '@react-spring/web';
import { IRefContext, OverlayLayer, RefContext } from '@components';
import { twMerge } from 'tailwind-merge';



export type TooltipPositionsType = 'left' | 'right' | 'top' | 'bottom';

interface ITooltipProps extends PropsWithChildren {
    className?: string;
    position: TooltipPositionsType;
    spacing?: number;
    animationOffset?: number;
}

// const tailSize = 5;
// const tailClasses = {
//     top: 'before:top-full before:absolute before:left-1/2 before:-translate-x-1/2 before:border-l-[5px] before:border-l-transparent before:border-r-[5px] before:border-r-transparent before:border-t-[5px] before:border-t-primary-500',
//     right: 'before:top-1/2 before:left-0 before:left-0 before:absolute before:-translate-y-1/2 before:-translate-x-full before:border-r-[5px] before:border-r-primary-500 before:border-t-[5px] before:border-t-transparent before:border-b-[5px] before:border-b-transparent',
//     bottom: 'before:top-0 before:left-1/2 before:absolute before:-translate-x-1/2 before:-translate-y-full before:border-l-[5px] before:border-l-transparent before:border-r-[5px] before:border-r-transparent before:border-b-[5px] before:border-b-primary-500',
//     left: 'before:top-1/2 before:left-full before:absolute before:-translate-y-1/2 before:border-l-[5px] before:border-l-primary-500 before:border-t-[5px] before:border-t-transparent before:border-b-[5px] before:border-b-transparent',
// };

export const Tooltip: FC<ITooltipProps> = ({
    className = '',
    children, 
    position, 
    spacing = 10,
    animationOffset = 15,
}) => {
    const { container, target } = useContext(RefContext) as IRefContext;
    const [isExist, setIsExist] = useState(false);
    const transition = useTransition(isExist, {
        from: { opacity: 0, animationOffset },
        enter: { opacity: 1, animationOffset: 0 },
        leave: { opacity: 0, animationOffset },
        config: { duration: 150 },
    });

    useEffect(() => {
        if (!container.current) return;
        const containerElem = container.current;

        containerElem.addEventListener('mouseenter', mount);
        containerElem.addEventListener('mouseleave', unmount);
        containerElem.addEventListener('focusin', mount);
        containerElem.addEventListener('focusout', unmount);

        return () => {
            containerElem.removeEventListener('mouseenter', mount);
            containerElem.removeEventListener('mouseleave', unmount);
            containerElem.removeEventListener('focusin', mount);
            containerElem.removeEventListener('focusout', unmount);
        };
    }, [container]);

    const mount = () => {
        setIsExist(true);
    };

    const unmount = () => {
        setIsExist(false);
    };

    const tooltip = () => {
        if (!target.current) return null;

        const rect = target.current.getBoundingClientRect();

        return transition((style, item) => {
            const positions = {
                top: {
                    translateX: '-50%',
                    translateY: to([style.animationOffset], (animationOffset) => `calc(-100% - ${animationOffset}px)`),
                    top: `${rect.top - spacing}px`,
                    left: `${rect.left + rect.width / 2}px`,
                },
                right: {
                    translateX: to([style.animationOffset], (animationOffset) => `${animationOffset}px`),
                    translateY: '-50%',
                    top: `${rect.top + rect.height / 2}px`,
                    left: `${rect.left + rect.width + spacing}px`,
                },
                bottom: {
                    translateX: '-50%',
                    translateY: to([style.animationOffset], (animationOffset) => `${animationOffset}px`),
                    top: `${rect.top + rect.height + spacing}px`,
                    left: `${rect.left + rect.width / 2}px`,
                },
                left: {
                    translateX: to([style.animationOffset], (animationOffset) => `calc(-100% - ${animationOffset}px)`),
                    translateY: '-50%',
                    top: `${rect.top + rect.height / 2}px`,
                    left: `${rect.left - spacing}px`,
                },
            };

            return (
                <OverlayLayer isRendered={item}>
                    <animated.div
                        className='fixed pointer-events-none'
                        style={{ 
                            opacity: style.opacity,
                            translateX: positions[position].translateX,
                            translateY: positions[position].translateY,
                            left: positions[position].left,
                            top: positions[position].top,
                        }}
                    >
                        <div 
                            className={twMerge(`relative bg-primary-500 text-ellipsis text-normal font-bold 
                            py-[5px] px-2.5 rounded-md w-max max-w-[300px] ${className}`)}
                        >
                            {children}
                        </div>
                    </animated.div>
                </OverlayLayer>
            );
        });
    };

    return tooltip();
};