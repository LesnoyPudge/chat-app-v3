import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useIsFirstRender } from '@hooks';
import { fpsToMs, throttle } from '@utils';



type ScrollbarRef = RefObject<HTMLDivElement | null>;

interface IOptions {
    startFromBottom?: boolean;
    autoScrollThreshold?: number;
    autoScrollDependency?: React.DependencyList;
}

const defaultOptions: Required<IOptions> = {
    startFromBottom: false,
    autoScrollThreshold: 1,
    autoScrollDependency: [],
};

export const useAutoScroll = (scrollbarRef: ScrollbarRef, options?: IOptions) => {
    const {
        startFromBottom,
        autoScrollThreshold,
        autoScrollDependency,
    } = Object.assign(defaultOptions, options);

    const isAutoScrollRef = useRef(startFromBottom);
    const isFirstRender = useIsFirstRender();

    const scrollToBottom = useCallback(() => {
        if (!scrollbarRef.current) return;
        scrollbarRef.current.scrollTop = scrollbarRef.current.scrollHeight;
    }, [scrollbarRef]);

    useEffect(() => {
        if (isFirstRender && startFromBottom) scrollToBottom();
    }, [startFromBottom, isFirstRender, scrollToBottom]);

    const handleScroll = useCallback(() => {
        if (!scrollbarRef.current) return;
    
        const scrollbar = scrollbarRef.current;
        const { 
            scrollTop = 0, 
            scrollHeight = 0, 
            clientHeight = 0,
        } = scrollbar;
        const currentScrollPos = scrollTop / (scrollHeight - clientHeight);
        const isFullyScrolled = currentScrollPos >= autoScrollThreshold;
        const isSameHeight = clientHeight === scrollHeight;
        const shouldEnableAutoScroll = isFullyScrolled || isSameHeight;
        const shouldDisableAutoScroll = !isFullyScrolled && !isSameHeight;

        if (shouldEnableAutoScroll) isAutoScrollRef.current = true;
        if (shouldDisableAutoScroll) isAutoScrollRef.current = false;
    }, [autoScrollThreshold, scrollbarRef]);

    useLayoutEffect(() => {
        if (isAutoScrollRef.current) scrollToBottom();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, autoScrollDependency);

    return {
        handleScroll,
        scrollToBottom,
    };
};