import { useLayoutEffect } from 'react';



type UseResizeObserver = (
    element: HTMLElement | (() => HTMLElement) | null,
    callback: ResizeObserverCallback,
) => void;

export const useResizeObserver: UseResizeObserver = (element, callback) => {
    useLayoutEffect(() => {
        if (!element) return;
        
        let target: HTMLElement;

        if (element instanceof Function) {
            target = element();
        } else {
            target = element;
        }

        const resizeObserver = new ResizeObserver(callback);

        resizeObserver.observe(target);

        return () => {
            resizeObserver.unobserve(target);
            resizeObserver.disconnect();
        };
    }, [element, callback]);
};