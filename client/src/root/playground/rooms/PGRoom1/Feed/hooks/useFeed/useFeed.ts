import { useRef } from "react";
import { ViewportListRef } from "react-viewport-list";
import { useInfiniteScroll, useAutoScroll } from "./hooks";
import { useKeyboardNavigationV2 } from "@hooks";



export const useFeed = () => {
    const scrollableRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const viewportListRef = useRef<ViewportListRef>(null);
    const placeholderWrapperRef = useRef<HTMLDivElement>(null);

    const {
        showIntroduction,
        showPlaceholders,
        list,
    } = useInfiniteScroll(scrollableRef, placeholderWrapperRef);

    useAutoScroll(scrollableRef);

    const {
        getIsFocused,
        getTabIndex,
    } = useKeyboardNavigationV2(contentRef, {
        list: list,
        loop: false,
        direction: 'vertical',
        initialFocusedId: list.at(-1)?.id,
        onFocusChange: ({next}) => {
            viewportListRef.current?.scrollToIndex({
                index: next.index,
            })
        },
    })

    return {
        scrollableRef,
        contentRef,
        viewportListRef,
        placeholderWrapperRef,
        list,
        getTabIndex,
        getIsFocused,
        showIntroduction,
        showPlaceholders,
    }
}