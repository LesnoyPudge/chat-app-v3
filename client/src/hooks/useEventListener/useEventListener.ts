import { RefObject, useEffect } from 'react';
import { useLatest } from 'react-use';
import { useProvidedValue } from '@hooks';
import { isRef } from '@typeGuards';



type ProvidedElement = RefObject<HTMLElement> | HTMLElement | null;

type UseEventListener = <T extends keyof HTMLElementEventMap>(
    event: T, 
    providedListener: (e: HTMLElementEventMap[T]) => void, 
    providedElement?: ProvidedElement,
) => React.Dispatch<React.SetStateAction<ProvidedElement>>;

export const useEventListener: UseEventListener = (
    event,
    providedListener,
    providedElement = null,
) => {
    const [element, setElement] = useProvidedValue(providedElement);
    const savedListener = useLatest(providedListener);
    
    useEffect(() => {
        const target = isRef(element) ? element.current : element;
        if (!target) return;
        const listener: typeof providedListener = (e) => savedListener.current(e);

        target.addEventListener(event, listener);

        return () => {
            target.removeEventListener(event, listener);
        };
    }, [element, event, savedListener]);
    
    return setElement;
};