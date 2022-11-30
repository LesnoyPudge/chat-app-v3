import { PropsWithChildren, useEffect, useState , FC, useContext } from 'react';
import { animated, useTransition, to } from '@react-spring/web';
import { Conditional, IRefContext, OverlayPortal, RefContext } from '@components';
import { twMerge } from 'tailwind-merge';
import { fpsToMs, throttle, twClassNames } from '@utils';



export type TooltipPositionsType = 'left' | 'right' | 'top' | 'bottom';

interface ITooltipProps extends PropsWithChildren {
    className?: string;
    position: TooltipPositionsType;
    spacing?: number;
    animationOffset?: number;
}

const styles = {
    wrapper: 'fixed pointer-events-none',
    inner: `relative bg-primary-500 text-ellipsis text-normal font-bold 
    py-[5px] px-2.5 rounded-md w-max max-w-[300px]`,
};

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
    const mount = () => setIsExist(true);
    const unmount = () => setIsExist(false);

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

    return transition((style, isRendered) => {
        if (!target.current) return null;

        const { top, left, width, height } = target.current.getBoundingClientRect();
        const positions = {
            top: {
                translateX: '-50%',
                translateY: to([style.animationOffset], (animationOffset) => `calc(-100% - ${animationOffset}px)`),
                top: `${top - spacing}px`,
                left: `${left + width / 2}px`,
            },
            right: {
                translateX: to([style.animationOffset], (animationOffset) => `${animationOffset}px`),
                translateY: '-50%',
                top: `${top + height / 2}px`,
                left: `${left + width + spacing}px`,
            },
            bottom: {
                translateX: '-50%',
                translateY: to([style.animationOffset], (animationOffset) => `${animationOffset}px`),
                top: `${top + height + spacing}px`,
                left: `${left + width / 2}px`,
            },
            left: {
                translateX: to([style.animationOffset], (animationOffset) => `calc(-100% - ${animationOffset}px)`),
                translateY: '-50%',
                top: `${top + height / 2}px`,
                left: `${left - spacing}px`,
            },
        };

        return (
            <OverlayPortal>
                <Conditional isRendered={isRendered}>
                    <animated.div
                        className={styles.wrapper}
                        style={{ 
                            opacity: style.opacity,
                            translateX: positions[position].translateX,
                            translateY: positions[position].translateY,
                            left: positions[position].left,
                            top: positions[position].top,
                        }}
                    >
                        <div className={twClassNames(styles.inner, className)}>
                            {children}
                        </div>
                    </animated.div>
                </Conditional>
            </OverlayPortal>
        );
    });
};