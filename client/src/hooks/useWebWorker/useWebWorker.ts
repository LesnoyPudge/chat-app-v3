import { AnyFunction } from '@shared';
import { createWebWorker } from '@utils';
import { useState, useRef } from 'react';





export const useWebWorker = <Arg = void, Return = void>(
    workerFunction: AnyFunction<[Arg], Return>,
): [
    Return | null,
    ReturnType<typeof createWebWorker<Arg, Return>>,
] => {
    const [state, setState] = useState<Return | null>(null);
    const workerRef = useRef(createWebWorker(workerFunction, setState));

    return [
        state,
        workerRef.current,
    ];
};