import { log, throttle } from '@utils';
import { useEffect, useRef, useState } from 'react';



export const useShrinkDetector = (ref: React.RefObject<HTMLDivElement | null>) => {
    const [originalWidth, setOriginalWidth] = useState(ref.current?.clientWidth);

    useEffect(() => {
        if (!ref) return;
        setOriginalWidth(ref.current?.clientWidth);
    }, [originalWidth, ref]);

    useEffect(() => {
        if (!originalWidth) return;

        const onResize = throttle(() => {
            log(window.innerWidth);
    
            log(originalWidth);
        }, 100);

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [originalWidth]);
};