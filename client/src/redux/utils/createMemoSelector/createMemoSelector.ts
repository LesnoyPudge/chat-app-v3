import { memoize } from 'proxy-memoize';



export const createMemoSelector = <ARGS extends object, RETURN>(
    fn: (args: ARGS) => RETURN,
    options?: {size?: number},
) => {
    return memoize(fn, Object.assign({ size: 50 }, options));
};