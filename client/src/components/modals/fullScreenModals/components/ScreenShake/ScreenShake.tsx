import { ChildrenAsNodeOrFunction } from '@components';
import { useThrottle } from '@hooks';
import { animated, useReducedMotion, useSpringValue } from '@react-spring/web';
import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getRandomNumber } from '@utils';
import { createContext, FC, useRef } from 'react';



export interface ScreenShakeContext {
    isThrottling: boolean;
    triggerScreenShake: () => void;
    resetShakeStacks: () => void;
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

export const ScreenShakeContext = createContext<ScreenShakeContext | undefined>(undefined);

export const ScreenShake: FC<ScreenShake> = ({
    children,
}) => {
    const shakeStackRef = useRef(shakeStack.min);
    const isMotionReduced = useReducedMotion();
    const windowShake = useSpringValue(0);
    const { isThrottling, throttle } = useThrottle();

    const resetShakeStacks = () => shakeStackRef.current = shakeStack.min;

    const triggerScreenShake = () => {
        if (isMotionReduced) return;

        throttle(() => {}, 2000)();

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
            const direction = getRandomNumber(0, 1) ? 1 : -1;
            const result = baseValue * shakeStackRef.current * direction;

            return `${result}px`;
        })
    );

    const contextValues: ScreenShakeContext = {
        isThrottling,
        resetShakeStacks,
        triggerScreenShake,
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