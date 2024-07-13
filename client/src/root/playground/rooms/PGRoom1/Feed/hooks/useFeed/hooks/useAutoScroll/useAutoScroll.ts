import { useEventListenerV2, useMutationObserver, useResizeObserverV2 } from "@hooks";
import { RefObject, useLayoutEffect, useRef, useState } from "react";
import { useIsInteracting } from "./hooks";


export const useAutoScroll = (scrollableRef: RefObject<HTMLElement>) => {
    const {isInteracting} = useIsInteracting(scrollableRef)
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const skipNextScrollEventRef = useRef(false);
    const shouldAutoScroll = !isInteracting && isAutoScrollEnabled;

    const enableAutoScroll = () => {
        if (isAutoScrollEnabled) return;

        setIsAutoScrollEnabled(true)
    }

    const disableAutoScroll = () => {
        if (!isAutoScrollEnabled) return;

        setIsAutoScrollEnabled(false)
    }

    const scrollToBottom = () => {
        const scrollable = scrollableRef.current;
        if (!scrollable) return;

        enableAutoScroll();

        skipNextScrollEventRef.current = true;
        scrollable.scrollTop = scrollable.scrollHeight
    }

    const getScrollDifference = () => {
        const scrollable = scrollableRef.current;
        if (!scrollable) return NaN;

        return (
            scrollable.scrollHeight 
            - scrollable.scrollTop 
            - scrollable.clientHeight
        )
    }

    const getIsAtBottom = () => {
        return getScrollDifference() <= 0;
    };

    useLayoutEffect(scrollToBottom, [])

    useMutationObserver(scrollableRef, () => {
        if (!shouldAutoScroll) return;
        if (getIsAtBottom()) return;
        
        scrollToBottom();
    }, { 
        childList: true, 
        subtree: true,
        attributes: false,
    })

    useResizeObserverV2(scrollableRef, () => {
        if (!shouldAutoScroll) return;

        scrollToBottom();
    })

    useEventListenerV2(scrollableRef, 'scroll', (e) => {
        if (skipNextScrollEventRef.current) {
            skipNextScrollEventRef.current = false;
            return;
        }

        if (isAutoScrollEnabled && !getIsAtBottom()) {
            return disableAutoScroll();
        }
        
        if (!isAutoScrollEnabled && getIsAtBottom()) {
            return enableAutoScroll()
        }
    });

    // scroll snap for mobile devices
    useEventListenerV2(scrollableRef, 'scrollend', (e) => {
        const diff = getScrollDifference();
        if (diff <= 0 || diff > 1) return;

        scrollToBottom()
    });

    return {
        shouldAutoScroll,
        scrollToBottom,
    }
}