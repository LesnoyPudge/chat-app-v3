import { useThrottle } from '@hooks';
import { fpsToMs } from '@utils';
import { useLayoutEffect, useState } from 'react';



export const useWindowSize = (throttleMS = fpsToMs(60)) => {
    const { throttle } = useThrottle();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useLayoutEffect(() => {
        const updateSize = throttle(() => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }, throttleMS);

        window.addEventListener('resize', updateSize);
        
        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, [throttle, throttleMS]);

    return windowSize;
};
  