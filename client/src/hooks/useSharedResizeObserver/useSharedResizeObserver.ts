import { isRef } from '@typeGuards';
import { ResizeObserverListener, noop, sharedResizeObserver } from '@utils';
import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { useLatest } from 'react-use';



type UseSharedResizeObserverResult<T extends Element> = [
    entry: Partial<ResizeObserverEntry>, 
    setTarget: (node: T | null) => void,
] & {
    entry: Partial<ResizeObserverEntry>; 
    setTarget: (node: T | null) => void;
}

export const useSharedResizeObserver = <T extends Element>(
    providedTargetRef?: RefObject<T> | T | null, 
    providedListener?: ResizeObserverListener,
): UseSharedResizeObserverResult<T> => {
    const resizeEntryRef = useRef<Partial<ResizeObserverEntry>>({});
    const savedListenerRef = useLatest(providedListener);
    const [target, setTarget] = useState<RefObject<T> | T | null>(null);

    useLayoutEffect(() => {
        if (!providedTargetRef || !!target) return;

        setTarget(providedTargetRef);
    }, [providedTargetRef, target]);

    useLayoutEffect(() => {
        const targetElement = isRef(target) ? target.current : target;
        if (!targetElement) return;

        const listener: ResizeObserverListener = (entry) => {
            resizeEntryRef.current = entry;
            (savedListenerRef.current || noop)(entry);
        };

        sharedResizeObserver.observe(targetElement, listener);

        return () => {
            sharedResizeObserver.unobserve(targetElement, listener);
        };
    }, [savedListenerRef, target]);

    const result = [
        resizeEntryRef.current, 
        setTarget,
    ] as UseSharedResizeObserverResult<T>;

    result.entry = result[0];
    result.setTarget = result[1];

    return result;
};