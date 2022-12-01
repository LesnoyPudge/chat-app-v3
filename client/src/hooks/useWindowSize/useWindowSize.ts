import { useThrottle } from '@hooks';
import { fpsToMs } from '@utils';
import { useLayoutEffect, useState } from 'react';



export const useWindowSize = (throttleDuration = fpsToMs(60)) => {
    const { throttle } = useThrottle();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useLayoutEffect(() => {
        const updateSize = throttle(() => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }, throttleDuration);

        window.addEventListener('resize', updateSize);
        
        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, [throttle, throttleDuration]);

    return windowSize;
};
  