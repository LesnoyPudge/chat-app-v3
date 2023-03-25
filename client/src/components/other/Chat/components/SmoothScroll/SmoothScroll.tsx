import { useSharedResizeObserver } from '@hooks';
import { animated, easings, useReducedMotion, useSpringValue } from '@react-spring/web';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, RefObject, useCallback, useLayoutEffect, useRef } from 'react';
import { useIsFirstRender } from 'usehooks-ts';



interface SmoothScroll extends PropsWithChildrenAndClassName {
    deps: unknown[];
    isAutoScrollEnabled: boolean;
    disabled: boolean;
}

export const SmoothScroll: FC<SmoothScroll> = ({
    className = '',
    deps,
    isAutoScrollEnabled,
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
            duration: 1500,
            easing: easings.linear,
        },
        onRest({ value }) {
            lastSpringValueRef.current = value;
        },
    });

    const smoothScroll = useCallback(() => {
        if (isMotionReduced) return;
        if (!wrapperRef.current) return;
        
        const from = (wrapperRef.current.offsetHeight - previousWrapperHeightRef.current) + lastSpringValueRef.current;
        console.log('from', from);
        
        spring.stop();
        spring.start({
            from: Math.max(from, 0),
            to: 0,
        });
    }, [isMotionReduced, spring]);

    // useLayoutEffect(() => {
    //     if (!isAutoScrollEnabled) return;

    //     smoothScroll();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [...deps, smoothScroll, isAutoScrollEnabled]);

    useSharedResizeObserver(wrapperRef, ({ contentRect }) => {
        // if (!isAutoScrollEnabledRef.current) return;
        // smoothScroll(); 
        console.log('wrapper resize', contentRect.height);
        previousWrapperHeightRef.current = contentRect.height;
    });

    // useSharedResizeObserver(wrapperRef, ({ contentRect }) => {
    //     console.log(`resizer item size: ${contentRect.height - previousWrapperHeightRef.current}`);

    //     // if (isAutoScrollEnabled) {
    //     //     smoothScroll();
    //     // }

    //     previousWrapperHeightRef.current = contentRect.height;
    // });

    useLayoutEffect(() => {
        if (!wrapperRef.current) return;

        console.log(`layout item size: ${wrapperRef.current.offsetHeight - previousWrapperHeightRef.current}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    useLayoutEffect(() => {
        if (disabled) return;
        if (!isAutoScrollEnabled) return;
        if (isMotionReduced) return;
        
        const offsetHeight = wrapperRef.current?.offsetHeight || 0;

        if (previousWrapperHeightRef.current === 0) {
            previousWrapperHeightRef.current = offsetHeight;
            return;
        }

        console.log(`prev: ${previousWrapperHeightRef.current} \n\n current: ${offsetHeight}`);
        
        const differenceInHeight = offsetHeight - previousWrapperHeightRef.current;
        console.log('diff', differenceInHeight);
        if (differenceInHeight <= 0) return;

        const from = differenceInHeight + lastSpringValueRef.current;
        console.log('from', from);
        
        spring.stop();
        spring.start({
            from: Math.max(from, 0),
            to: 0,
        });

        previousWrapperHeightRef.current = offsetHeight;
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, isAutoScrollEnabled]);

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