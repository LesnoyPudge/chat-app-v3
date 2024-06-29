import { useThrottle } from "@hooks";
import { noop } from "@lesnoypudge/utils";
import { useConst } from "@lesnoypudge/utils-react";
import { useReducedMotion, useSpringValue } from "@react-spring/web";
import { AnyFunction, getRandomNumber } from "@shared";
import { useRef } from "react";



const baseShakeValue = 5;

const shakeStacks = {
    min: 1,
    max: 3,
    step: 0.5,
};

export const useShake = () => {
    const shakeStackRef = useRef(shakeStacks.min);
    const isMotionReduced = useReducedMotion();
    const windowShake = useSpringValue(0);
    const { isThrottling, throttle } = useThrottle();

    const resetShakeStacks = useConst(() => () => {
        shakeStackRef.current = shakeStacks.min
    });

    const withResetShakeStacks = useConst(() => <
        _Function extends AnyFunction
    >(fn: _Function) => {
        return (...args: Parameters<_Function>) => {
            resetShakeStacks()
            fn(...args);
        };
    });

    const triggerScreenShake = useConst(() => () => {
        if (isMotionReduced) return;

        throttle(noop, 2000)();

        windowShake.start(1, {
            config: {
                duration: shakeStackRef.current * 100,
            },
        }).then(() => windowShake.reset());

        shakeStackRef.current = Math.min(
            shakeStackRef.current + shakeStacks.step, 
            shakeStacks.max
        );
    });

    const getWindowShakeValue = useConst(() => () => {
        return windowShake.to({
            range: [0, 0.01, 1],
            output: [0, 1, 0],
        }).to((shakePower) => {
            // if (value === 0) return value;

           
            const orientation = getRandomNumber(0, 1) ? 1 : -1;
            const result = (
                shakePower 
                * baseShakeValue 
                * shakeStackRef.current 
                * orientation
            );

            return `${result}px`;
        })
    });

    return {
        isShaking: isThrottling,
        resetShakeStacks,
        triggerScreenShake,
        withResetShakeStacks,
        getWindowShakeValue,
    };
}