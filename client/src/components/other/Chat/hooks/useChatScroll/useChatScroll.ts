import { IMessage } from '@backendTypes';
import { EmojiCode } from '@components';
import { useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLatest } from 'react-use';
import { ViewportListRef } from 'react-viewport-list';



type Message = IMessage & {
    reactions: {
        code: EmojiCode;
        users: string[];
    }[];
}

export const useChatScroll = (messages: Message[]) => {
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null);
    const [contentWrapperElement, setContentWrapperElement] = useState<HTMLElement | null>(null);
    const [autoScrollTriggerElement, setAutoScrollTriggerElement] = useState<HTMLElement | null>(null);
    const isAutoScrollEnabledRef = useRef(true);
    const messageLengthRef = useLatest(messages.length);
    const [indexesShift, setIndexesShift] = useState(messageLengthRef.current);
    const [viewportList, setViewportList] = useState<ViewportListRef | null>(null);
    const earliestMessageTimestampRef = useRef(messages[0].createdAt);
    const [placeholder, setPlaceholder] = useState<HTMLElement | null>(null);
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(false);

    const scrollToBottom = useCallback(() => {
        if (!contentWrapperElement) return;
        
        contentWrapperElement.scrollTop = contentWrapperElement.scrollHeight;
    }, [contentWrapperElement]);

    useSharedIntersectionObserver(autoScrollTriggerElement, ({ isIntersecting }) => {
        isAutoScrollEnabledRef.current = isIntersecting;
    });

    const handleNewIndexes = (indexes: [number, number]) => {
        if (!isAutoScrollEnabledRef.current) return;
        if (!viewportList) return;
    
        // viewportList.scrollToIndex({ 
        //     index: indexes[1],
        //     prerender: 20,
        // });
    };

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;

        setIndexesShift(messageLengthRef.current);
    }, [messages, messageLengthRef]);

    useSharedResizeObserver(contentElement, () => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    });

    useSharedResizeObserver(contentWrapperElement, () => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    });

    useSharedIntersectionObserver(placeholder, ({ isIntersecting }) => {
        setIsPlaceholderVisible(isIntersecting);
    });

    useLayoutEffect(() => {
        if (!placeholder) return;
        if (!viewportList) return;
        if (!contentWrapperElement) return;
        
        const previousTimestamp = earliestMessageTimestampRef.current;
        const currentTimestamp = messages[0].createdAt;
        if (currentTimestamp >= previousTimestamp) return;

        const currentScrollPosition = contentWrapperElement.scrollTop;

        const messageIndex = messages.findIndex((message) => message.createdAt === previousTimestamp);

        const offset = placeholder.offsetHeight - currentScrollPosition;

        const shouldAlignToBottom = offset > contentWrapperElement.offsetHeight;
        viewportList.scrollToIndex({
            index: messageIndex,
            prerender: 20,
            offset: shouldAlignToBottom ? 0 : -(offset),
            alignToTop: shouldAlignToBottom ? false : true,
        });

        earliestMessageTimestampRef.current = currentTimestamp;
    }, [contentWrapperElement, messages, placeholder, viewportList]);

    return {
        setContentElement,
        setContentWrapperElement,
        setAutoScrollTriggerElement,
        indexesShift,
        setViewportList,
        handleNewIndexes,
        setPlaceholder,
        isPlaceholderVisible,
        contentWrapperElement,
        viewportList,
    };
};