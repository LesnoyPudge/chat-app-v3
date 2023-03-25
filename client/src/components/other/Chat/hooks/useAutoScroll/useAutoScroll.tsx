import { useAnimationFrame, useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import SimpleBarCore from 'simplebar-core';



export const useAutoScroll = (deps: unknown[] = []) => {
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