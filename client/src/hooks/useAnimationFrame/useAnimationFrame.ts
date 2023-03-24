import { useEffect, useRef, useCallback, MutableRefObject, useLayoutEffect } from 'react';
import { useLatest } from 'react-use';



type Callback = (time: number) => void;

export const useAnimationFrame = (callback: Callback) => {
    const frameRef = useRef<number>();
    const savedCallbackRef = useLatest<Callback>(callback);
      
    useLayoutEffect(() => {
        const animate: Callback = (time) => {
            savedCallbackRef.current(time);
            frameRef.current = requestAnimationFrame(animate);
        };
        
        frameRef.current = requestAnimationFrame(animate);

        return () => {
            frameRef.current && cancelAnimationFrame(frameRef.current);
        };
    }, [savedCallbackRef]);
};