import { useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { useCallback, useLayoutEffect, useRef } from 'react';
import SimpleBarCore from 'simplebar-core';
import { useAnimationFrame } from 'src/hooks/useAnimationFrame/useAnimationFrame';



export const useAutoScroll = (deps: unknown[] = []) => {
    const simpleBarRef = useRef<SimpleBarCore | null>(null);
    const isAutoScrollEnabledRef = useRef(false);

    // useAnimationFrame(() => {
    //     if (!isAutoScrollEnabledRef.current) return;
    //     if (!simpleBarRef.current) return;
        
    //     const contentWrapper = simpleBarRef.current.contentWrapperEl;
    //     if (!contentWrapper) return;
    //     if (contentWrapper.scrollTop === contentWrapper.scrollHeight) return;

    //     simpleBarRef.current?.contentWrapperEl?.scrollTo({
    //         top: 99999999,
    //         behavior: 'auto',
    //     });
    // });
    

    const scrollToBottom = useCallback(() => {
        if (!simpleBarRef.current?.contentWrapperEl) return;
        
        simpleBarRef.current.contentWrapperEl.scrollTo({
            top: 99999999,
            behavior: 'auto',
        });
    }, []);

    // useLayoutEffect(() => {
    //     if (!isAutoScrollEnabledRef.current) return;
    //     scrollToBottom();
        
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [...deps, scrollToBottom]);

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
    });

    return {
        simpleBarRef,
        resizableWrapperRef,
        autoScrollTriggerRef,
        isAutoScrollEnabledRef,
    };
};