import { AnyFunction } from 'ts-essentials';
import { noop } from '@utils';



const getWorkerCode = (workerFunction: AnyFunction) => (`
    const workerFunction = (${workerFunction});

    onmessage = (event) => {
        const args = event.data;
        const result = workerFunction(args);
        postMessage(result);
    };
`);

export const createWebWorker = <Arg = void, Return = void>(
    fn: AnyFunction<[Arg], Return>,
    onSuccess: AnyFunction<[Return]> = noop,
    onError: AnyFunction<[ErrorEvent]> = noop,
) => {
    let worker: Worker | null = null;

    const run = (arg: Arg) => {
        return new Promise<Return | null>((resolve, reject) => {
            const workerCode = getWorkerCode(fn);
            const workerBlob = new Blob([workerCode], {
                type: 'application/javascript',
            });

            worker = new Worker(URL.createObjectURL(workerBlob));

            worker.onerror = (event) => {
                reject(event);
                onError(event);
            };

            worker.onmessage = (event) => {
                resolve(event.data);
                onSuccess(event.data);
            };

            worker.postMessage(arg);
        });
    };

    const terminate = () => {
        worker?.terminate();
        worker = null;
    };

    return {
        run,
        terminate,
    };
};
