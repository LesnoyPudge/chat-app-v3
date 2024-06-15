import { RefObject, useRef, useState } from 'react';
import { useChatLoad, useChatScroll } from '..';
import { ViewportListRef } from 'react-viewport-list';
import { useKeyboardNavigation, useLatest } from '@hooks';
import { SliceEntityState } from '@types';



interface ViewportItemRefs {
    messageWrapperRef: RefObject<HTMLElement>,
    messageRef: RefObject<HTMLElement>,
}

export type NormalizedViewportItemRefs = Map<string, ViewportItemRefs>;

export const useChat = (messages: SliceEntityState.Message[]) => {
    const messagesRef = useLatest(messages);
    const messagesLengthRef = useLatest(messages.length);
    const firstMessageCreationDateRef = useLatest(messages.at(0)?.createdAt || null);
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

    useChatLoad({
        placeholderElement,
        firstMessageCreationDateRef,
    });

    const {
        getIsFocused,
        setFocusedId,
        getTabIndex,
        setViewportIndexes,
    } = useKeyboardNavigation(
        messagesRef,
        contentWrapperElement,
        {
            direction: 'vertical',
            loop: false,
            virtualized: true,
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
        normalizedViewportItemRefs,
        setViewportIndexes,
        setContentWrapperElement,
        setContentElement,
        setPlaceholderElement,
        setAutoScrollTriggerElement,
        setViewportList,
        getIsFocused,
        setFocusedId,
        getTabIndex,
    };
};