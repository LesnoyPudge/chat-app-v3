import { useRef, useCallback, useEffect } from 'react';
import { useLatest } from '@hooks';



type Callback = (time: number) => void;

type Options = {
    initialState?: boolean;
    logDuration?: boolean;
    skipFrames?: number;
}

const defaultOption: Required<Options> = {
    initialState: true,
    logDuration: false,
    skipFrames: 0,
};

export const useAnimationFrame = (
    callback: Callback,
    options?: Options,
) => {
    const frameRef = useRef<number | null>(null);
    const optionsRef = useRef(Object.assign({}, defaultOption, options));
    const isWorkingRef = useRef(optionsRef.current.initialState);
    const skipFramesRef = useRef(optionsRef.current.skipFrames);

    const animateRef = useLatest<Callback>((time) => {
        if (!isWorkingRef.current) return;

        if (skipFramesRef.current > 0) {
            skipFramesRef.current--;
            frameRef.current = requestAnimationFrame(animateRef.current);
            return;
        }

        if (skipFramesRef.current <= 0) {
            skipFramesRef.current = optionsRef.current.skipFrames;
        }

        if (optionsRef.current.logDuration) {
            console.time('logDuration');
        }

        callback(time);

        if (optionsRef.current.logDuration) {
            console.timeEnd('logDuration');
        }

        frameRef.current = requestAnimationFrame(animateRef.current);
    });

    const start = useCallback(() => {
        if (isWorkingRef.current) return;

        isWorkingRef.current = true;
        frameRef.current = requestAnimationFrame(animateRef.current);
    }, [animateRef]);

    const stop = useCallback(() => {
        if (!isWorkingRef.current || !frameRef.current) return;

        cancelAnimationFrame(frameRef.current);

        isWorkingRef.current = false;
        frameRef.current = null;
    }, []);

    useEffect(() => {
        if (!isWorkingRef.current) return;

        frameRef.current = requestAnimationFrame(animateRef.current);
    }, [animateRef]);

    useEffect(() => {
        return () => {
            if (frameRef.current === null) return;

            cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return {
        start,
        stop,
    };
};