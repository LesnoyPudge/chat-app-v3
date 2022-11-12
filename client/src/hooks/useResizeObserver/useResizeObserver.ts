import { useEffect } from 'react';



type UseResizeObserver = (
    element: HTMLElement | null,
    callback: ResizeObserverCallback,
) => void;

export const useResizeObserver: UseResizeObserver = (element, callback) => {
    useEffect(() => {
        if (!element) return;

        const resizeObserver = new ResizeObserver(callback);

        resizeObserver.observe(element);

        return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        };
    }, [callback, element]);
};