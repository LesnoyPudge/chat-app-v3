import { AnyFunction } from '@types';
import { useState, useRef, useCallback, useMemo } from 'react';



type UseWebWorkerReturn<CallBack extends AnyFunction> = [(...args: Parameters<CallBack>) => void, State<ReturnType<CallBack>>]

interface State<T> {
    data: T | null;
    error: Error | null;
}

const initialState: State<never> = {
    data: null,
    error: null,
};

export const useWebWorker = <CallBack extends AnyFunction>(workerFunction: CallBack): UseWebWorkerReturn<CallBack> => {
    const [state, setState] = useState<State<ReturnType<CallBack>>>(initialState);
    const workerRef = useRef<Worker | null>(null);
  
    const workerHelpers = useMemo(() => ({
        create: (worker: Worker) => {
            workerRef.current?.terminate();
            workerRef.current = worker;
        },
        reset: () => {
            setState(initialState);
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
    }), []);
  
    const runWorker = useCallback((...args: Parameters<CallBack>) => {
        const workerCode = `
                const workerFunction = (${workerFunction});

                onmessage = (event) => {
                    const n = event.data;
                    try {
                    const result = workerFunction(n);
                    postMessage({ result });
                    } catch (error) {
                    postMessage({ error });
                    }
                };
            `;
  
        const createWorker = () => {
            const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
            const newWorker = new Worker(URL.createObjectURL(workerBlob));
            workerHelpers.create(newWorker);
            newWorker.onmessage = handleMessage;
            newWorker.onerror = handleError;
            newWorker.postMessage(args);
        };
  
        const handleMessage = (event: MessageEvent) => {
            if (event.data.error) {
                workerHelpers.onError(event.data.error);
                return;
            }
            workerHelpers.onSuccess(event.data.result || null);
        };
  
        const handleError = (event: ErrorEvent) => {
            workerHelpers.onError(event.error);
        };
  
        if (workerRef.current) {
            workerRef.current.terminate();
            createWorker();
        } else {
            createWorker();
        }
    }, [workerFunction, workerHelpers]);
  
    return [runWorker, state];
};