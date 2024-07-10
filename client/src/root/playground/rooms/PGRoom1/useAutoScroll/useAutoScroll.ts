import { useEventListenerV2, useMutationObserver, useResizeObserverV2 } from "@hooks";
import { RefObject, useCallback, useLayoutEffect, useRef } from "react";



type Options = {
    initialState?: boolean;
}

export const useAutoScroll = (
    scrollableElementRef: RefObject<HTMLElement>,
    // lastElementRef: RefObject<HTMLElement>,
    options?: Options,
) => {
    const {
        initialState = true,
    } = options ?? {};

    const isAutoScrollEnabledRef = useRef(initialState);
    const skipNextScrollEventRef = useRef(false);
    
    const enableAutoScroll = useCallback(() => {
        isAutoScrollEnabledRef.current = true;
    }, [])

    const disableAutoScroll = () => {
        isAutoScrollEnabledRef.current = false;
    }

    const scrollToBottom = useCallback(() => {
        const scrollable = scrollableElementRef.current;
        if (!scrollable) return;
        
        // scrollable.lastElementChild?.scrollIntoView({
        //     block: 'end',
        // });

        // lastElementRef.current?.scrollIntoView({
        //     block: 'end'
        // })

        scrollable.scrollTop = scrollable.scrollHeight

        skipNextScrollEventRef.current = true;

        enableAutoScroll();

        // scrollable.scrollTop = (
        //     scrollable.scrollHeight 
        //     - scrollable.clientHeight
        // );
    }, [])

    const isAtBottom = () => {
        const scrollable = scrollableElementRef.current;
        if (!scrollable) return false;

        const diff = scrollable.scrollHeight - scrollable.scrollTop;

        return diff === scrollable.clientHeight;
        // return Math.floor(diff - scrollable.clientHeight) === 0;
    };

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return
        
        scrollToBottom()
    }, [])

    useMutationObserver(scrollableElementRef, () => {
        if (!isAutoScrollEnabledRef.current) return;

        skipNextScrollEventRef.current = true;
        scrollToBottom();
    }, { 
        childList: true, 
        subtree: true 
    })

    useResizeObserverV2(scrollableElementRef, () => {
        if (!isAutoScrollEnabledRef.current) return;

        skipNextScrollEventRef.current = true;
        scrollToBottom();
    })

    useEventListenerV2(scrollableElementRef, 'scroll', (e) => {
        if (skipNextScrollEventRef.current) {
            skipNextScrollEventRef.current = false;
            return;
        }

        if (isAutoScrollEnabledRef.current && !isAtBottom()) {
            return disableAutoScroll();
        }
        
        if (!isAutoScrollEnabledRef.current && isAtBottom()) {
            return enableAutoScroll()
        }
    });

    return {
        scrollToBottom,
    }
}