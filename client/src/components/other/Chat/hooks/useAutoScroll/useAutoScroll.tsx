import { useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { useLayoutEffect, useRef } from 'react';
import SimpleBarCore from 'simplebar-core';
import { useIsFirstRender } from 'usehooks-ts';



export const useAutoScroll = (deps: unknown[] = []) => {
    const isFirstRender = useIsFirstRender();
    const simpleBarRef = useRef<SimpleBarCore>(null);
    const isAutoScrollEnabledRef = useRef(true);

    const scrollToBottom = () => {
        const contentWrapper = simpleBarRef.current?.contentWrapperEl;
        const content = simpleBarRef.current?.contentEl;
        if (!contentWrapper || !content) return;

        contentWrapper.scrollTop = contentWrapper.scrollHeight;
    };

    useLayoutEffect(() => {
        if (isAutoScrollEnabledRef.current && !isFirstRender) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    const [__, resizableWrapperRef] = useSharedResizeObserver(undefined, () => {
        if (isAutoScrollEnabledRef.current) scrollToBottom();
    });

    useSharedResizeObserver(simpleBarRef.current?.contentEl || null, () => {
        if (isAutoScrollEnabledRef.current) scrollToBottom();
    });

    useLayoutEffect(() => {
        if (isFirstRender) scrollToBottom();
    }, [isFirstRender]);

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