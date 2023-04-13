import { ObjectWithId } from '@types';
import { RefObject, useCallback, useRef, useState } from 'react';
import { useLatest } from 'react-use';
import { useChatLoad, useChatScroll } from '..';
import { IMessage } from '@backendTypes';
import { ViewportListRef } from 'react-viewport-list';
import { useKeyboardNavigation } from '../../useKeyboardNavigation';
import { useRefWithSetter } from '@hooks';



interface ViewportItemRefs {
    messageWrapperRef: RefObject<HTMLElement>,
    messageRef: RefObject<HTMLElement>,
}

export type NormalizedViewportItemRefs = Map<string, ViewportItemRefs>;

export const useChat = (messages: IMessage[]) => {
    const messagesRef = useLatest(messages);
    const messagesLengthRef = useLatest(messages.length);
    const firstMessageCreationDateRef = useLatest(messages.at(0)?.createdAt || null);
    const [messagesInViewportRef, setMessagesInViewportRef] = useRefWithSetter<ObjectWithId[]>([]);
    const normalizedViewportItemRefs = useRef<NormalizedViewportItemRefs>(new Map());
    
    const [contentWrapperElement, setContentWrapperElement] = useState<HTMLElement | null>(null);
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null);
    const [placeholderElement, setPlaceholderElement] = useState<HTMLElement | null>(null);
    const [autoScrollTriggerElement, setAutoScrollTriggerElement] = useState<HTMLElement | null>(null);
    const [viewportList, setViewportList] = useState<ViewportListRef | null>(null);

    const {
        indexesShift,
    } = useChatScroll({
        messages,
        contentWrapperElement,
        contentElement,
        autoScrollTriggerElement,
        placeholderElement,
        viewportList,
        messagesLengthRef,
    });

    const {
        isAtStart,
    } = useChatLoad({
        placeholderElement,
        firstMessageCreationDateRef,
    });

    const handleViewportIndexesChange = useCallback((indexes: [number, number]) => {
        const startIndex = Math.max(0, indexes[0] - 1);
        const endIndex = Math.min(messagesLengthRef.current, indexes[1] + 1);
        console.log(startIndex, endIndex);
        setMessagesInViewportRef(messagesRef.current.slice(
            startIndex, 
            endIndex,
        ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        getIsFocused,
        setFocusedId,
    } = useKeyboardNavigation(
        messagesInViewportRef,
        contentWrapperElement, 
        {
            direction: 'vertical',
            loop: false,
            initialFocusableId: messages.at(-1)?.id,
            onFocusChange: (item) => {
                if (!item) return;
                if (!normalizedViewportItemRefs.current) return;

                const itemRefs = normalizedViewportItemRefs.current.get(item.id);
                if (!itemRefs) return;

                itemRefs.messageWrapperRef.current?.scrollIntoView({ block: 'center' });
            },
        },
    );

    return {
        indexesShift,
        isAtStart,
        normalizedViewportItemRefs,
        handleViewportIndexesChange,
        setContentWrapperElement,
        setContentElement,
        setPlaceholderElement,
        setAutoScrollTriggerElement,
        setViewportList,
        getIsFocused,
        setFocusedId,
    };
};