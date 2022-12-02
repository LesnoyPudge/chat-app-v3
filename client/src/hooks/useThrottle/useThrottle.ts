import { fpsToMs } from '@utils';
import { useCallback, useRef, useState } from 'react';



export const useThrottle = () => {
    const throttleRef = useRef(false);
    const calledDuringThrottleRef = useRef(false);
    const lastArgsRef = useRef<never[] | null>(null);
    const [isThrottling, setIsThrottling] = useState(throttleRef.current);

    const throttle = useCallback(<F extends (...args: never[]) => void>(
        callback: F, 
        delayMS = fpsToMs(60),
    ) => {
        const timeoutFunc = () => {
            if (!calledDuringThrottleRef.current) {
                throttleRef.current = false;
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
            if (throttleRef.current) {
                lastArgsRef.current = args;
                calledDuringThrottleRef.current = true;
                return;
            }
      
            throttleRef.current = true;
            setIsThrottling(true);
            callback(...args);
            setTimeout(timeoutFunc, delayMS);
        };
    }, []);

    return {
        throttle,
        isThrottling,
    };
};