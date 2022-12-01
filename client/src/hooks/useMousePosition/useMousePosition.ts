import { fpsToMs } from '@utils';
import { useEffect, useState } from 'react';
import { useThrottle } from '@hooks';



export const useMousePosition = (throttleMS = fpsToMs(60)) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { throttle } = useThrottle();

    useEffect(() => {
        const handleMouseMove = throttle((e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        }, throttleMS);

        document.addEventListener('mousemove', handleMouseMove);
        
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [throttle, throttleMS]);

    return mousePosition;
};