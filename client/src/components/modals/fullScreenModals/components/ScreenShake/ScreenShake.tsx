import { ChildrenAsNodeOrFunction } from '@components';
import { useThrottle } from '@hooks';
import { animated, useReducedMotion, useSpringValue } from '@react-spring/web';
import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getRandomNumber, noop } from '@utils';
import { createContext, FC, useRef } from 'react';
import { AnyFunction } from 'ts-essentials';



export interface ScreenShakeContext {
    isThrottling: boolean;
    triggerScreenShake: () => void;
    resetShakeStacks: () => void;
    withResetShakeStacks: <T extends AnyFunction>(fn: T) => (...args: Parameters<T>) => void;
}

type ScreenShake = PropsWithClassName & PropsWithChildrenAsNodeOrFunction<ScreenShakeContext>

const styles = {
    screenShake: 'will-change-transform transition-transform ease-linear duration-[20ms]',
};

const shakeStack = {
    min: 1,
    max: 3,
    step: 0.5,
};

export const ScreenShakeContext = createContext<ScreenShakeContext>();

export const ScreenShake: FC<ScreenShake> = ({
    children,
}) => {
    const shakeStackRef = useRef(shakeStack.min);
    const isMotionReduced = useReducedMotion();
    const windowShake = useSpringValue(0);
    const { isThrottling, throttle } = useThrottle();

    const resetShakeStacks = () => shakeStackRef.current = shakeStack.min;

    const withResetShakeStacks = <T extends AnyFunction>(fn: T) => {
        return (...args: Parameters<T>) => {
            shakeStackRef.current = shakeStack.min;
            fn(...args);
        };
    };

    const triggerScreenShake = () => {
        if (isMotionReduced) return;

        throttle(noop, 2000)();

        windowShake.start(1, {
            config: {
                duration: shakeStackRef.current * 100,
            },
        }).then(() => windowShake.reset());

        shakeStackRef.current = Math.min(shakeStackRef.current + shakeStack.step, shakeStack.max);
    };

    const getWindowShakeValue = () => (
        windowShake.to({
            range: [0, 0.01, 1],
            output: [0, 1, 0],
        }).to((value) => {
            if (value === 0) return 0;

            const baseValue = 5;
            const orientation = getRandomNumber(0, 1) ? 1 : -1;
            const result = baseValue * shakeStackRef.current * orientation;

            return `${result}px`;
        })
    );

    const contextValues: ScreenShakeContext = {
        isThrottling,
        resetShakeStacks,
        triggerScreenShake,
        withResetShakeStacks,
    };

    return (
        <ScreenShakeContext.Provider value={contextValues}>
            <animated.div
                className={styles.screenShake}
                style={{
                    translateX: getWindowShakeValue(),
                    translateY: getWindowShakeValue(),
                }}
            >
                <ChildrenAsNodeOrFunction args={contextValues}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </animated.div>
        </ScreenShakeContext.Provider>
    );
};