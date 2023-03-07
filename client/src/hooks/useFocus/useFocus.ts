import { RefObject, useState } from 'react';
import { useEventListener } from 'usehooks-ts';



export const useFocus = (ref: RefObject<HTMLElement>) => {
    const [isFocused, setIsFocused] = useState(false);

    useEventListener('focusin', () => setIsFocused(true), ref);
    useEventListener('focusout', () => setIsFocused(false), ref);

    return isFocused;
};