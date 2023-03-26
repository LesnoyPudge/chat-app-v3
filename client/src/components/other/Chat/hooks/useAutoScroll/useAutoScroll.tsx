import { useAnimationFrame, useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLatest } from 'react-use';
import SimpleBarCore from 'simplebar-core';
import { useEventListener } from 'usehooks-ts';



export const useAutoScroll = (messages: unknown[] = []) => {
    const simpleBarRef = useRef<SimpleBarCore | null>(null);
    const isAutoScrollEnabledRef = useRef(false);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);

    const scrollToBottom = useCallback(() => {
        if (!simpleBarRef.current?.contentWrapperEl) return;
        
        simpleBarRef.current.contentWrapperEl.scrollTo({
            top: 99999999,
            behavior: 'auto',
        });
    }, []);

    // useAnimationFrame(() => {
    //     if (!isAutoScrollEnabledRef.current) return;

    //     if (!simpleBarRef.current?.contentWrapperEl) return;

    //     const wrapper = simpleBarRef.current?.contentWrapperEl;

    //     console.log(wrapper.scrollHeight, wrapper.scrollTop, wrapper.clientHeight);
    //     if (wrapper.scrollHeight - wrapper.scrollTop === wrapper.clientHeight) return;
    //     console.log('run frame');

    //     scrollToBottom();
    // });

    const lastMessagesLengthRef = useLatest(messages.length);
    const lastScrollPositionRef = useRef(0);
    const previousWrapperScrollHeightRef = useRef(0);
    const contentWrapperEl = useLatest(simpleBarRef.current?.contentWrapperEl || null);

    // useLayoutEffect(() => {
    //     const wrapper = simpleBarRef.current?.contentWrapperEl;
    //     console.log('?', messages.length, lastMessagesLengthRef.current);
    //     if (!wrapper) return;
    //     // if (messages.length <= lastMessagesLengthRef.current) return;

    //     const wrapperScrollHeight = wrapper.scrollHeight;

    //     if (previousWrapperScrollHeightRef.current === 0) {
    //         previousWrapperScrollHeightRef.current = wrapperScrollHeight;
    //     }
        
    //     const differenceInHeight = wrapperScrollHeight - previousWrapperScrollHeightRef.current;
    //     console.log(differenceInHeight, lastScrollPositionRef.current, wrapperScrollHeight, previousWrapperScrollHeightRef.current);
    //     wrapper.scrollTop = lastScrollPositionRef.current + differenceInHeight;
        
    //     previousWrapperScrollHeightRef.current = wrapperScrollHeight;
    // }, [lastMessagesLengthRef, lastScrollPositionRef, messages]);
    const previousContentHeightRef = useRef(0);
    // useSharedResizeObserver(simpleBarRef.current?.contentEl, ({ contentRect }) => {
    //     previousContentHeightRef.current = contentRect.height;
    // });

    // useSharedResizeObserver(simpleBarRef.current?.contentEl, ({ contentRect }) => {
    //     console.log('resize', contentRect.height);

    //     const content = simpleBarRef.current?.contentEl;
    //     const wrapper = simpleBarRef.current?.contentWrapperEl;
    //     if (!content || !wrapper) return;

    //     if (previousContentHeightRef.current === 0) {
    //         previousContentHeightRef.current = contentRect.height;
    //     }

    //     console.log({
    //         contentHeight: contentRect.height,
    //         prevHeig: previousContentHeightRef.current,
    //     });
    //     const diff = contentRect.height - previousContentHeightRef.current;
    //     console.log({
    //         diff: diff,
    //         lastScrollPosition: lastScrollPositionRef.current,
    //     });
    //     wrapper.scrollTop = lastScrollPositionRef.current + diff;

    //     previousContentHeightRef.current = contentRect.height;
    // });

    useLayoutEffect(() => {
        const contentWrapper = simpleBarRef.current?.contentWrapperEl || null;
        if (!contentWrapper) return;

        const handleScroll = (e: Event) => {
            const scrollTop = (e.target as HTMLElement).scrollTop || 0;
            console.log('scroll', scrollTop);
            lastScrollPositionRef.current = scrollTop;
        };

        contentWrapper.addEventListener('scroll', handleScroll);

        return () => {
            contentWrapper.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useLayoutEffect(() => {
        
        const content = simpleBarRef.current?.contentEl;
        const wrapper = simpleBarRef.current?.contentWrapperEl;
        if (!content || !wrapper) return;
        
        const contentHeight = content.offsetHeight;

        if (previousContentHeightRef.current === 0) {
            previousContentHeightRef.current = contentHeight;
        }

        // if (previousContentHeightRef.current > contentHeight) return;
        
        console.log({
            contentHeight: contentHeight,
            prevHeig: previousContentHeightRef.current,
        });
        const diff = contentHeight - previousContentHeightRef.current;
        console.log({
            diff: diff,
            lastScrollPosition: lastScrollPositionRef.current,
        });
        wrapper.scrollTop = lastScrollPositionRef.current + diff;
        previousContentHeightRef.current = contentHeight;
    }, [messages]);

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;
        scrollToBottom();
    });

    useSharedResizeObserver(simpleBarRef.current?.contentEl, () => {
        if (!isAutoScrollEnabledRef.current) return;
        scrollToBottom();
    });

    const [__, resizableWrapperRef] = useSharedResizeObserver(undefined, () => {
        if (!isAutoScrollEnabledRef.current) return;
        scrollToBottom();
    });

    const [_, autoScrollTriggerRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        isAutoScrollEnabledRef.current = isIntersecting;
        setIsAutoScrollEnabled(isIntersecting);
    });

    return {
        simpleBarRef,
        resizableWrapperRef,
        autoScrollTriggerRef,
        isAutoScrollEnabled,
    };
};