import { useLatest } from "@lesnoypudge/utils-react";
import { RefObject, useEffect } from "react";



export const useMutationObserver = (
    elementRef: RefObject<HTMLElement>,
    callback: MutationCallback,
    options?: MutationObserverInit,
) => {
    const lastCallbackRef = useLatest(callback);
    const optionsRef = useLatest(options);

    useEffect(() => {
        if (!elementRef.current) return;

        const observer = new MutationObserver((...args) => {
            lastCallbackRef.current(...args)
        })

        observer.observe(elementRef.current, optionsRef.current);

        return () => {
            observer.disconnect();
        }
    }, [])
}