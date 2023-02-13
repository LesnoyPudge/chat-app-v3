import { MutableRefObject, useCallback, useLayoutEffect, useRef } from 'react';
import { useResizeObserver } from '@hooks';
import { useInView } from 'react-intersection-observer';
import { useIsFirstRender } from 'usehooks-ts';



interface IOptions {
    startFromBottom?: boolean;
    autoScrollDependency?: unknown[];
}

type SetRefType = (node: HTMLDivElement | null) => void;

interface IReturn {
    scrollableRef: MutableRefObject<HTMLDivElement | null>;
    setAutoScrollTriggerRef: SetRefType;
}

type UseAutoScroll = (options?: IOptions) => IReturn;

const defaultOptions: Required<IOptions> = {
    startFromBottom: false,
    autoScrollDependency: [],
};

export const useAutoScroll: UseAutoScroll = (options) => {
    const isFirstRender = useIsFirstRender();
    const scrollableRef = useRef<HTMLDivElement | null>(null);
    const [setAutoScrollTriggerRef, isAutoScroll] = useInView({ threshold: 0 });
    const {
        startFromBottom,
        autoScrollDependency,
    } = Object.assign(defaultOptions, options);

    // const setScrollbarRef: SetRefType = (node) => {
    //     scrollableRef.current = node;
    // };

    const scrollToBottom = useCallback(() => {
        if (!scrollableRef.current) return;
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }, []);

    const autoScroll = useCallback(() => {
        if (isAutoScroll) scrollToBottom();
    }, [isAutoScroll, scrollToBottom]);

    useResizeObserver(scrollableRef.current, autoScroll);

    useLayoutEffect(() => {
        if (isFirstRender && startFromBottom) scrollToBottom();
    }, [startFromBottom, isFirstRender, scrollToBottom]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => autoScroll(), [...autoScrollDependency]);

    return {
        scrollableRef,
        setAutoScrollTriggerRef,
    };
};