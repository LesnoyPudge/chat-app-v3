import { useRef, useCallback, useLayoutEffect } from 'react';
import { useLatest } from '@hooks';



export const useAnimationFrame = (
    callback: () => void,
    enabled: boolean,
) => {
    const frameIdRef = useRef(0);
    const lastCallbackRef = useLatest(callback)

    const frame = useCallback(() => {
        frameIdRef.current = requestAnimationFrame(frame)
        lastCallbackRef.current();
    }, [lastCallbackRef]);

    useLayoutEffect(() => {
        if (!enabled) return;

        frame();

        return () => cancelAnimationFrame(frameIdRef.current);
    }, [enabled, frame]);

    const start = useCallback(() => frame(), [frame]);

    const stop = useCallback(() => {
        cancelAnimationFrame(frameIdRef.current);
    }, [])

    return {
        start,
        stop,
    }
}