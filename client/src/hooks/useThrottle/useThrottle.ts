import { useStateAndRef } from '@hooks';
import { fpsToMs } from '@utils';
import { useCallback, useRef, useState } from 'react';



export const useThrottle = () => {
    const calledDuringThrottleRef = useRef(false);
    const lastArgsRef = useRef<never[] | null>(null);
    const [isThrottling, isThrottlingRef, setIsThrottling] = useStateAndRef(false);

    const throttle = useCallback(<F extends (...args: never[]) => void>(
        callback: F, 
        delayMS = fpsToMs(60),
    ) => {
        const timeoutFunc = () => {
            if (!calledDuringThrottleRef.current) {
                lastArgsRef.current = null;
                setIsThrottling(false);
                return;
            }

            callback(...lastArgsRef.current || []);
            calledDuringThrottleRef.current = false;
            lastArgsRef.current = null;
            setTimeout(timeoutFunc, delayMS);
        };
        
        return (...args: Parameters<F>): void => {
            if (isThrottlingRef.current) {
                lastArgsRef.current = args;
                calledDuringThrottleRef.current = true;
                return;
            }
      
            setIsThrottling(true);
            callback(...args);
            setTimeout(timeoutFunc, delayMS);
        };
    }, [isThrottlingRef, setIsThrottling]);

    return {
        throttle,
        isThrottling,
        isThrottlingRef,
    };
};