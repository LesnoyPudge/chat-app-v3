import { useSharedResizeObserver } from '@hooks';
import { animated, easings, useReducedMotion, useSpringValue } from '@react-spring/web';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, RefObject, useLayoutEffect, useRef } from 'react';
import { useIsFirstRender } from 'usehooks-ts';



interface SmoothScroll extends PropsWithChildrenAndClassName {
    deps: unknown[];
    isAutoScrollEnabledRef: RefObject<boolean>;
    disabled: boolean;
}

export const SmoothScroll: FC<SmoothScroll> = ({
    className = '',
    deps,
    isAutoScrollEnabledRef,
    disabled,
    children,
}) => {
    const isMotionReduced = useReducedMotion();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const previousWrapperHeightRef = useRef(0);
    const differenceInHeightRef = useRef(0);
    const lastSpringValueRef = useRef(0);
    const spring = useSpringValue (0, {
        config: {
            duration: 150,
            easing: easings.linear,
        },
        onRest({ value }) {
            lastSpringValueRef.current = value;
        },
    });

    const smoothScroll = () => {
        if (!wrapperRef.current) return;

        const from = (wrapperRef.current.offsetHeight - previousWrapperHeightRef.current) + lastSpringValueRef.current;
        console.log('from', from);
        
        spring.stop();
        spring.start({
            from: Math.max(from, 0),
            to: 0,
        });
    };

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;

        smoothScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, smoothScroll]);

    useSharedResizeObserver(wrapperRef, ({ contentRect }) => {
        // if (!isAutoScrollEnabledRef.current) return;
        // smoothScroll(); 
        previousWrapperHeightRef.current = contentRect.height;
    });

    // useSharedResizeObserver(wrapperRef, ({ contentRect }) => {
    //     console.log(`resizer item size: ${contentRect.height - previousWrapperHeightRef.current}`);
    //     previousWrapperHeightRef.current = contentRect.height;
    // });

    // useLayoutEffect(() => {
    //     if (!wrapperRef.current) return;

    //     console.log(`layout item size: ${wrapperRef.current.offsetHeight - previousWrapperHeightRef.current}`);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [...deps]);

    useLayoutEffect(() => {
        if (disabled) return;
        if (!isAutoScrollEnabledRef.current) return;
        if (isMotionReduced) return;
        return;
        const offsetHeight = wrapperRef.current?.offsetHeight || 0;

        if (previousWrapperHeightRef.current === 0) {
            previousWrapperHeightRef.current = offsetHeight;
            return;
        }
        
        differenceInHeightRef.current = offsetHeight - previousWrapperHeightRef.current;
        
        smoothScroll();

        // previousWrapperHeightRef.current = offsetHeight;
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    return (
        <animated.div 
            className={twClassNames('flex grow h-fit overflow-hidden', className)}
            style={{
                transform: spring.to((value) => `translateY(${value}px)`),
            }}
            ref={wrapperRef}
        >
            {children}
        </animated.div>
    );
};