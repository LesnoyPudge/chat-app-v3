import { RefObject, useEffect } from 'react';
import { useProvidedValue, useLatest } from '@hooks';
import { isRef } from '@typeGuards';



type ProvidedElement = RefObject<HTMLElement> | HTMLElement | Document | Window | null;

type EventMap = HTMLElementEventMap & DocumentEventMap & WindowEventMap;

export const useEventListener = <T extends keyof EventMap>(
    event: T,
    providedListener: (e: EventMap[T]) => void,
    providedElement: ProvidedElement,
) => {
    const [element, setElement] = useProvidedValue(providedElement);
    const savedListener = useLatest(providedListener);

    useEffect(() => {
        const target = isRef(element) ? element.current : element;
        if (!target) return;

        const listener: EventListener = (e) => savedListener.current(e as EventMap[T]);

        target.addEventListener(event, listener);

        return () => {
            target.removeEventListener(event, listener);
        };
    }, [element, event, savedListener]);

    return setElement;
};