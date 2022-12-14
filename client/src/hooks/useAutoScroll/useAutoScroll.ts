import { useCallback, useLayoutEffect, useRef } from 'react';
import { useIsFirstRender, useResizeObserver } from '@hooks';
import { useInView } from 'react-intersection-observer';



interface IOptions {
    startFromBottom?: boolean;
    autoScrollDependency?: unknown[];
}

type SetRefType = (node: HTMLElement | null) => void;

interface IReturn {
    setScrollbarRef: SetRefType;
    setAutoScrollTriggerRef: SetRefType;
}

type UseAutoScroll = (options?: IOptions) => IReturn;

const defaultOptions: Required<IOptions> = {
    startFromBottom: false,
    autoScrollDependency: [],
};

export const useAutoScroll: UseAutoScroll = (options) => {
    const isFirstRender = useIsFirstRender();
    const scrollbarRef = useRef<HTMLElement | null>(null);
    const [setAutoScrollTriggerRef, isAutoScroll] = useInView({ threshold: 0 });
    const {
        startFromBottom,
        autoScrollDependency,
    } = Object.assign(defaultOptions, options);

    const setScrollbarRef: SetRefType = (node) => {
        scrollbarRef.current = node;
    };

    const scrollToBottom = useCallback(() => {
        if (!scrollbarRef.current) return;
        scrollbarRef.current.scrollTop = scrollbarRef.current.scrollHeight;
    }, []);

    const autoScroll = useCallback(() => {
        if (isAutoScroll) scrollToBottom();
    }, [isAutoScroll, scrollToBottom]);

    useResizeObserver(scrollbarRef.current, autoScroll);

    useLayoutEffect(() => {
        if (isFirstRender && startFromBottom) scrollToBottom();
    }, [startFromBottom, isFirstRender, scrollToBottom]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => autoScroll(), [...autoScrollDependency]);

    return {
        setScrollbarRef,
        setAutoScrollTriggerRef,
    };
};