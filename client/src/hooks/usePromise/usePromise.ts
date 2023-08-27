import { noop } from '@utils';
import { useCallback, useEffect, useMemo, useState } from 'react';



export type ControlledPromise<T> = {
    promise: Promise<T>;
    data: T | null;
    isRejected: boolean;
    isResolved: boolean;
    reject: (v: T) => void;
    resolve: (v: T) => void;
    reset: () => void;
};

const createPromise = <T,>() => {
    let resolve: (v: T) => void = noop;
    let reject: (v: T) => void = noop;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        promise,
        resolve,
        reject,
    };
};

export const usePromise = <T,>(): ControlledPromise<T> => {
    const [basePromise, setBasePromise] = useState(createPromise<T>());
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState({
        isRejected: false,
        isResolved: false,
    });

    const {
        promise,
        reject,
        resolve,
    } = basePromise;

    const reset = useCallback(() => {
        setBasePromise(createPromise<T>());
    }, []);

    useEffect(() => {
        promise.then((v) => {
            setData(v);
            setStatus({
                isRejected: false,
                isResolved: true,
            });
        }).catch(() => {
            setStatus({
                isRejected: true,
                isResolved: false,
            });
        });
    }, [promise]);

    return {
        data,
        promise,
        isRejected: status.isRejected,
        isResolved: status.isResolved,
        reject,
        resolve,
        reset,
    };
};