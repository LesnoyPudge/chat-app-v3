import { useCallback, useRef, useState } from 'react';



export const useThrottle = () => {
    const throttleRef = useRef(false);
    const calledDuringThrottleRef = useRef(false);
    const lastArgsRef = useRef<never[] | null>(null);
    const [isThrottling, setIsThrottling] = useState(throttleRef.current);

    const throttle = useCallback(<F extends (...args: never[]) => void>(callback: F, delay = 200) => {
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
            setTimeout(timeoutFunc, delay);
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
            setTimeout(timeoutFunc, delay);
        };
    }, []);

    return {
        throttle,
        isThrottling,
    };
};