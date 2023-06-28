import { useRefWithSetter } from '@hooks';
import { useRef, useCallback, useEffect } from 'react';
import { useLatest } from 'react-use';



type Callback = (time: number) => void;

export const useAnimationFrame = (
    callback: Callback, 
    initialState = true,
) => {
    const frameRef = useRef<number>();
    const savedCallbackRef = useLatest<Callback>(callback);  
    const [isWorkingRef, setIsWorkingRef] = useRefWithSetter(initialState);

    const start = useCallback(() => {
        if (isWorkingRef.current) return;

        setIsWorkingRef(true);

        const animate: Callback = (time) => {
            savedCallbackRef.current(time);
            frameRef.current = requestAnimationFrame(animate);
        };
        
        frameRef.current = requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stop = useCallback(() => {
        if (!isWorkingRef.current) return;

        setIsWorkingRef(false);

        frameRef.current && cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isWorkingRef.current) return;

        const animate: Callback = (time) => {
            savedCallbackRef.current(time);
            frameRef.current = requestAnimationFrame(animate);
        };
        
        frameRef.current = requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            frameRef.current && cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return {
        start,
        stop,
    };
};