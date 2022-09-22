import { useRef, useState } from 'react';



export const useThrottle = () => {
    const [isThrottling, setIsThrottling] = useState(false);
    const lastArgs = useRef<never[] | null>(null);

    const throttle = <F extends (...args: never[]) => unknown>(callback: F, delay = 200) => {
        const timeoutFunc = () => {
            if (lastArgs.current === null) return setIsThrottling(false);
            
            callback(...lastArgs.current);
            lastArgs.current = null;
            setTimeout(timeoutFunc, delay);
        };
      
        return (...args: Parameters<F>) => {
            if (isThrottling) return lastArgs.current = args;
      
            callback(...args);
            setIsThrottling(true);
      
            setTimeout(timeoutFunc, delay);
        };
    };


    return {
        throttle,
        isThrottling,
    };
};