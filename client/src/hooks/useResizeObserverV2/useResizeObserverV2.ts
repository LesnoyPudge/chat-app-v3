import { useLatest } from '@lesnoypudge/utils-react';
import { RefObject, useEffect } from 'react';



export const useResizeObserverV2 = (
    elementRef: RefObject<HTMLElement>, 
    callback: ResizeObserverCallback,
    options?: ResizeObserverOptions,
) => {
    const lastCallbackRef = useLatest(callback);
    const optionsRef = useLatest(options);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new ResizeObserver((...args) => {
            lastCallbackRef.current(...args)
        });

        observer.observe(element, optionsRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);
};