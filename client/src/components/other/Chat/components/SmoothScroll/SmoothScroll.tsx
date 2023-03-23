import { animated, useReducedMotion, useSpringValue } from '@react-spring/web';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, RefObject, useLayoutEffect, useRef } from 'react';



interface SmoothScroll extends PropsWithChildrenAndClassName {
    deps: unknown[];
    isAutoScrollEnabledRef: RefObject<boolean>;
}

export const SmoothScroll: FC<SmoothScroll> = ({
    className = '',
    deps,
    isAutoScrollEnabledRef,
    children,
}) => {
    const isMotionReduced = useReducedMotion();
    const spring = useSpringValue (0, {
        config: {
            duration: 150,
        },
    });
    const prevSpringValueRef = useRef(0);

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;
        if (isMotionReduced) return;

        spring.stop();
        spring.set(0);
        spring.start(1);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    const prevValue = prevSpringValueRef.current;

    return (
        <animated.div 
            className={twClassNames('flex grow h-fit', className)}
            style={{
                transform: spring
                    .to({
                        range: [0, 1],
                        output: [prevValue + 56, 0],
                    })
                    .to((value) => {
                        prevSpringValueRef.current = value;
                        return `translateY(${value}px)`;
                    }),
            }}
        >
            {children}
        </animated.div>
    );
};