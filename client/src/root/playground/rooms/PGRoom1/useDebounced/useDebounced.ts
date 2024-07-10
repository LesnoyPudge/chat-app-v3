import { debounce } from "@lesnoypudge/utils";
import { AnyFunction } from "@shared";
import { useMemo, useRef } from "react";
import { useIsMounted } from "usehooks-ts";



export const useDebounced = <
    _CallBack extends AnyFunction,
>(
    callback: _CallBack,
    delay: number,
): _CallBack => {
    const callbackRef = useRef(callback);
    const delayRef = useRef(delay);
    const isMounted = useIsMounted();

    return useMemo(() => {
        return debounce((...args: Parameters<_CallBack>) => {
            if (!isMounted()) return;
            return callbackRef.current(...args)
        }, delayRef.current) as _CallBack;
    }, []);
}