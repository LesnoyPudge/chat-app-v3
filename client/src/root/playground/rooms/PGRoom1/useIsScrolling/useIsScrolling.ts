import { useEventListenerV2 } from "@hooks";
import { RefObject, useState } from "react";



export const useIsScrolling = (scrollableRef: RefObject<HTMLElement>) => {
    const [isScrolling, setIsScrolling] = useState(false);
    
    useEventListenerV2(scrollableRef, 'scroll', () => {
        if (isScrolling) return;

        setIsScrolling(true);
    })

    useEventListenerV2(scrollableRef, 'scrollend', () => {
        setIsScrolling(false);
    })

    return {
        isScrolling
    }
}