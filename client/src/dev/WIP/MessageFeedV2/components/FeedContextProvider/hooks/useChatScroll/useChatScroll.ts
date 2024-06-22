import { useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { SliceEntityState } from '@types';
import { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ViewportListRef } from 'react-viewport-list';



interface UseChatScrollProps {
    messages: SliceEntityState.Message[];
    contentWrapperElement: HTMLElement | null;
    contentElement: HTMLElement | null;
    autoScrollTriggerElement: HTMLElement | null;
    placeholderElement: HTMLElement | null;
    viewportList: ViewportListRef | null;
    messagesLengthRef: RefObject<number>;
}

export const useChatScroll = ({
    messages,
    autoScrollTriggerElement,
    contentElement,
    contentWrapperElement,
    placeholderElement,
    viewportList,
    messagesLengthRef,
}: UseChatScrollProps) => {
    const isAutoScrollEnabledRef = useRef(true);
    const [indexesShift, setIndexesShift] = useState(messagesLengthRef.current || 0);
    const earliestMessageTimestampRef = useRef(messages[0].createdAt);

    const scrollToBottom = useCallback(() => {
        if (!contentWrapperElement) return;
        
        contentWrapperElement.scrollTop = contentWrapperElement.scrollHeight;
    }, [contentWrapperElement]);

    useSharedIntersectionObserver(autoScrollTriggerElement, ({ isIntersecting }) => {
        isAutoScrollEnabledRef.current = isIntersecting;
    });

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;

        setIndexesShift(messagesLengthRef.current || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    useSharedResizeObserver(contentElement, () => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    });

    useSharedResizeObserver(contentWrapperElement, () => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    });

    useLayoutEffect(() => {
        if (!placeholderElement) return;
        if (!viewportList) return;
        if (!contentWrapperElement) return;
        
        const previousTimestamp = earliestMessageTimestampRef.current;
        const currentTimestamp = messages[0].createdAt;
        if (currentTimestamp >= previousTimestamp) return;

        const currentScrollPosition = contentWrapperElement.scrollTop;
        const messageIndex = messages.findIndex((message) => message.createdAt === previousTimestamp);
        const offset = placeholderElement.offsetHeight - currentScrollPosition;
        const shouldAlignToBottom = offset > contentWrapperElement.offsetHeight;

        viewportList.scrollToIndex({
            index: messageIndex,
            prerender: 20,
            offset: shouldAlignToBottom ? 0 : -(offset),
            alignToTop: shouldAlignToBottom ? false : true,
        });

        earliestMessageTimestampRef.current = currentTimestamp;
    }, [contentWrapperElement, messages, placeholderElement, viewportList]);

    return {
        indexesShift,
    };
};