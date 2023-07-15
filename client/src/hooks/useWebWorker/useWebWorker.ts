import { AnyFunction } from '@shared';
import { useState, useRef, useEffect } from 'react';



type UseWebWorkerReturn<CallBack extends AnyFunction> = [
    (...args: Parameters<CallBack>) => void,
    State<ReturnType<CallBack>>
]

interface State<T> {
    data: T | null;
    error: Error | null;
}

const initialState: State<never> = {
    data: null,
    error: null,
};

const getWorkerCode = (workerFunction: AnyFunction) => (`
    const workerFunction = (${workerFunction});

    onmessage = (event) => {
        try {
            const args = event.data;
            const result = workerFunction(args);
            postMessage({ result });
        } catch (error) {
            postMessage({ error });
        }
    };
`);

export const useWebWorker = <CallBack extends AnyFunction>(
    workerFunction: CallBack,
): UseWebWorkerReturn<CallBack> => {
    const [state, setState] = useState<State<ReturnType<CallBack>>>(initialState);
    const workerRef = useRef<Worker | null>(null);

    const workerHelpersRef = useRef({
        create: (worker: Worker) => {
            workerRef.current?.terminate();
            workerRef.current = worker;
        },
        reset: () => {
            setState(initialState);
            workerRef.current?.terminate();
            workerRef.current = null;
        },
        onError: (error: Error) => {
            setState({
                data: null,
                error,
            });
            workerRef.current = null;
        },
        onSuccess: (data: ReturnType<CallBack> | null) => {
            setState({
                data,
                error: null,
            });
            workerRef.current = null;
        },
    });

    const runWorker = useRef((...args: Parameters<CallBack>) => {
        const workerCode = getWorkerCode(workerFunction);
        const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
        const newWorker = new Worker(URL.createObjectURL(workerBlob));

        workerHelpersRef.current.create(newWorker);

        newWorker.onerror = (event) => workerHelpersRef.current.onError(event.error);
        newWorker.onmessage = (event) => {
            if (event.data.error) return workerHelpersRef.current.onError(event.data.error);
            workerHelpersRef.current.onSuccess(event.data.result || null);
        };

        newWorker.postMessage(args);
    });

    useEffect(() => {
        const reset = workerHelpersRef.current.reset;

        return () => {
            reset();
        };
    }, []);

    return [runWorker.current, state];
};