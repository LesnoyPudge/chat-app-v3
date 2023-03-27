import { isRef } from '@typeGuards';
import { IntersectionObserverListener, noop, sharedIntersectionObserver } from '@utils';
import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { useLatest } from 'react-use';



type UseSharedIntersectionObserverResult<T extends Element> = [
    entry: Partial<IntersectionObserverEntry>, 
    setTarget: (node: T | null) => void,
] & {
    entry: Partial<IntersectionObserverEntry>; 
    setTarget: (node: T | null) => void;
}

export const useSharedIntersectionObserver = <T extends Element>(
    providedTargetRef?: RefObject<T> | T | null, 
    providedListener?: IntersectionObserverListener,
): UseSharedIntersectionObserverResult<T> => {
    const intersectionEntryRef = useRef<Partial<IntersectionObserverEntry>>({});
    const savedListenerRef = useLatest(providedListener);
    const [target, setTarget] = useState<RefObject<T> | T | null>(null);

    useLayoutEffect(() => {
        if (!providedTargetRef || !!target) return;

        setTarget(providedTargetRef);
    }, [providedTargetRef, target]);
    
    useLayoutEffect(() => {
        const targetElement = isRef(target) ? target.current : target;
        if (!targetElement) return;

        const listener: IntersectionObserverListener = (entry) => {
            intersectionEntryRef.current = entry;
            (savedListenerRef.current || noop)(entry);
        };

        sharedIntersectionObserver.observe(targetElement, listener);

        return () => {
            sharedIntersectionObserver.unobserve(targetElement, listener);
        };
    }, [savedListenerRef, target]);

    const result = [
        intersectionEntryRef.current, 
        setTarget,
    ] as UseSharedIntersectionObserverResult<T>;

    result.entry = result[0];
    result.setTarget = result[1];

    return result;
};