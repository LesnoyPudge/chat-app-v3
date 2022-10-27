import { fpsToMs, throttle } from '@utils';
import { useLayoutEffect, useState } from 'react';



export const useWindowSize = (throttleDuration = fpsToMs(60)) => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const updateSize = throttle(() => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }, throttleDuration);

        updateSize();

        window.addEventListener('resize', updateSize);
        
        return () => {
            window.removeEventListener('resize', updateSize);
        };
    }, [throttleDuration]);

    return windowSize;
};
  