import { useCallback, useEffect, useRef } from 'react';
import { AnyFunction } from 'ts-essentials';
import { useLatest } from '@hooks';



export const useTimeout = (
    cb: AnyFunction,
    providedDelay = 0,
    manual = false,
) => {
    const timeoutIdRef = useRef(0);
    const cbRef = useLatest(cb);
    const providedDelayRef = useLatest(providedDelay);
    const cancelTimeoutRef = useRef(() => {
        clearTimeout(timeoutIdRef.current);
    });

    const createTimeout = useCallback((delay = providedDelayRef.current) => {
        timeoutIdRef.current = setTimeout(() => {
            cbRef.current();
        }, delay);
    }, [cbRef, providedDelayRef]);

    useEffect(() => {
        if (manual) return;

        createTimeout(providedDelay);
        const cancel = cancelTimeoutRef.current;

        return () => {
            cancel();
        };
    }, [providedDelay, manual, createTimeout, cancelTimeoutRef]);

    const start = useCallback((delay?: number) => {
        cancelTimeoutRef.current();
        createTimeout(delay);
    }, [createTimeout]);

    const cancel = useCallback(() => {
        cancelTimeoutRef.current();
    }, []);

    return {
        start,
        cancel,
    };
};