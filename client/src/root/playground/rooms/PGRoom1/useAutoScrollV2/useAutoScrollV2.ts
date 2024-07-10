import { useEventListenerV2, useMutationObserver, useResizeObserverV2 } from "@hooks";
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIsInteracting } from "./useIsInteracting/useIsInteracting";
import { useIsScrolling } from "../useIsScrolling/useIsScrolling";



export const useAutoScrollV2 = (
    scrollableRef: RefObject<HTMLElement>,
    contentRef: RefObject<HTMLElement>,
) => {
    const {isInteracting} = useIsInteracting(scrollableRef)
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    // const isAutoScrollEnabledRef = useRef(true);
    const skipNextScrollEventRef = useRef(false);
    // const {isScrolling} = useIsScrolling(scrollableRef);
    // useEffect(() => {
    //     console.log(JSON.stringify({isScrolling}, null, 4))
    // }, [isScrolling])
    const shouldAutoScroll = !isInteracting && isAutoScrollEnabled;

    // useEffect(() => {
    //     console.log(JSON.stringify({
    //         isInteracting,
    //         isAutoScrollEnabled,
    //         shouldAutoScroll,
    //     }, null, 4))
    // }, [
    //     isInteracting,
    //     isAutoScrollEnabled,
    //     shouldAutoScroll,
    // ])

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

        console.log('scroll to bottom')
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
        // const scrollable = scrollableRef.current;
        // if (!scrollable) return false;


        return getScrollDifference() <= 0;
        // const diff = scrollable.scrollHeight - scrollable.scrollTop;
        // // const diff = (
        // //     scrollable.scrollHeight 
        // //     - scrollable.scrollTop 
        // //     - scrollable.clientHeight
        // // )
        // return diff === scrollable.clientHeight;
        // return Math.floor(diff - scrollable.clientHeight) === 0;
    };

    useLayoutEffect(scrollToBottom, [])

    useMutationObserver(scrollableRef, () => {
        if (!shouldAutoScroll) return;
        if (getIsAtBottom()) return;
        
        console.log('mutation')
        scrollToBottom();
    }, { 
        childList: true, 
        subtree: true,
        attributes: false,
    })

    useResizeObserverV2(scrollableRef, () => {
        if (!shouldAutoScroll) return;
        // console.log('resize')
        scrollToBottom();
    })

    useEventListenerV2(scrollableRef, 'scroll', (e) => {
        // console.log(JSON.stringify({
        //     skipNextScroll: skipNextScrollEventRef.current,
        //     disableAutoScroll: isAutoScrollEnabled && !getIsAtBottom(),
        //     enableAutoScroll: !isAutoScrollEnabled && getIsAtBottom(),
        //     diff: (
        //         scrollableRef.current!.scrollHeight 
        //         - scrollableRef.current!.scrollTop 
        //         - scrollableRef.current!.clientHeight
        //     ),
        // }, null, 4))

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