import { useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { ObjectWithId } from '@types';
import { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ViewportListRef } from 'react-viewport-list';



interface UseChatScrollProps {
    messages: ObjectWithId[];
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


// import { IMessage } from '@backendTypes';
// import { EmojiCode } from '@components';
// import { useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
// import { useCallback, useLayoutEffect, useRef, useState } from 'react';
// import { useLatest } from 'react-use';
// import { ViewportListRef } from 'react-viewport-list';



// type Message = IMessage & {
//     reactions: {
//         code: EmojiCode;
//         users: string[];
//     }[];
// }

// export const useChatScroll = (messages: Message[]) => {
//     const [contentElement, setContentElement] = useState<HTMLElement | null>(null);
//     const [contentWrapperElement, setContentWrapperElement] = useState<HTMLElement | null>(null);
//     const [autoScrollTriggerElement, setAutoScrollTriggerElement] = useState<HTMLElement | null>(null);
//     const isAutoScrollEnabledRef = useRef(true);
//     const messagesLengthRef = useLatest(messages.length);
//     const [indexesShift, setIndexesShift] = useState(messagesLengthRef.current);
//     const [viewportList, setViewportList] = useState<ViewportListRef | null>(null);
//     const earliestMessageTimestampRef = useRef(messages[0].createdAt);
//     const [placeholder, setPlaceholder] = useState<HTMLElement | null>(null);
//     const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(false);

//     const scrollToBottom = useCallback(() => {
//         if (!contentWrapperElement) return;
        
//         contentWrapperElement.scrollTop = contentWrapperElement.scrollHeight;
//     }, [contentWrapperElement]);

//     useSharedIntersectionObserver(autoScrollTriggerElement, ({ isIntersecting }) => {
//         isAutoScrollEnabledRef.current = isIntersecting;
//     });

//     useLayoutEffect(() => {
//         if (!isAutoScrollEnabledRef.current) return;

//         setIndexesShift(messagesLengthRef.current);
//     }, [messages, messagesLengthRef]);

//     useSharedResizeObserver(contentElement, () => {
//         if (!isAutoScrollEnabledRef.current) return;

//         scrollToBottom();
//     });

//     useSharedResizeObserver(contentWrapperElement, () => {
//         if (!isAutoScrollEnabledRef.current) return;

//         scrollToBottom();
//     });

//     useSharedIntersectionObserver(placeholder, ({ isIntersecting }) => {
//         setIsPlaceholderVisible(isIntersecting);
//     });

//     useLayoutEffect(() => {
//         if (!placeholder) return;
//         if (!viewportList) return;
//         if (!contentWrapperElement) return;
        
//         const previousTimestamp = earliestMessageTimestampRef.current;
//         const currentTimestamp = messages[0].createdAt;
//         if (currentTimestamp >= previousTimestamp) return;

//         const currentScrollPosition = contentWrapperElement.scrollTop;

//         const messageIndex = messages.findIndex((message) => message.createdAt === previousTimestamp);

//         const offset = placeholder.offsetHeight - currentScrollPosition;

//         const shouldAlignToBottom = offset > contentWrapperElement.offsetHeight;
//         viewportList.scrollToIndex({
//             index: messageIndex,
//             prerender: 20,
//             offset: shouldAlignToBottom ? 0 : -(offset),
//             alignToTop: shouldAlignToBottom ? false : true,
//         });

//         earliestMessageTimestampRef.current = currentTimestamp;
//     }, [contentWrapperElement, messages, placeholder, viewportList]);

//     return {
//         setContentElement,
//         setContentWrapperElement,
//         setAutoScrollTriggerElement,
//         indexesShift,
//         setViewportList,
//         setPlaceholder,
//         isPlaceholderVisible,
//         contentWrapperElement,
//         viewportList,
//     };
// };