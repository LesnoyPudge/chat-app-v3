import { useAnimationFrame, useSharedIntersectionObserver, useSharedResizeObserver } from '@hooks';
import { easings, Spring, useSpringValue } from '@react-spring/web';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ViewportListRef } from 'react-viewport-list';
import SimpleBarCore from 'simplebar-core';



export const useChatScroll = (messages: unknown[]) => {
    const [simpleBar, setSimpleBar] = useState<SimpleBarCore | null>(null);
    const [autoScrollTriggerElement, setAutoScrollTriggerElement] = useState<HTMLElement | null>(null);
    const isAutoScrollEnabledRef = useRef(true);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const [indexesShift, setIndexesShift] = useState(messages.length);

    const scrollToBottom = useCallback(() => {
        if (!simpleBar?.contentWrapperEl) return;

        simpleBar.contentWrapperEl.scrollTop = simpleBar.contentWrapperEl.scrollHeight;
    }, [simpleBar]);

    useSharedIntersectionObserver(autoScrollTriggerElement, ({ isIntersecting }) => {
        isAutoScrollEnabledRef.current = isIntersecting;
        setIsAutoScrollEnabled(isIntersecting);
    });

    useEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    }, [scrollToBottom, messages]);

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;

        setIndexesShift(messages.length);
    }, [messages]);

    useSharedResizeObserver(simpleBar?.contentEl, () => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    });

    useSharedResizeObserver(simpleBar?.contentWrapperEl, () => {
        if (!isAutoScrollEnabledRef.current) return;

        scrollToBottom();
    });

    // preserve scroll position
    const lastContentHeightRef = useRef(0);
    const lastScrollPosition = useRef(0);
    const [placeholder, setPlaceholder] = useState<HTMLElement | null>(null);
    const isPlaceholderVisibleRef = useRef(false);


    useSharedIntersectionObserver(placeholder, ({ isIntersecting }) => {
        isPlaceholderVisibleRef.current = isIntersecting;
    });


    // useLayoutEffect(() => {
    //     if (isAutoScrollEnabledRef.current) return;
    //     if (!viewportListRef) return;
    //     const content = simpleBar?.contentEl;
    //     if (!content) return;


    //     const contentHeight = content.offsetHeight;

    //     console.log({
    //         scrollPos: lastScrollPosition.current,
    //         height: contentHeight,
    //         lastHeight: lastContentHeightRef.current,
    //     });
    
    //     const differenceInHeight = contentHeight - lastContentHeightRef.current;
    //     const newScrollPosition = lastScrollPosition.current + differenceInHeight;
    //     viewportListRef.scrollToIndex({
    //         offset: newScrollPosition,
    //     });
    // }, [messages, simpleBar, viewportListRef]);
    
    // useSharedResizeObserver(simpleBar?.contentEl, ({ contentRect }) => {
    //     lastContentHeightRef.current = contentRect.height;
    // });

    useLayoutEffect(() => {
        const contentWrapper = simpleBar?.contentWrapperEl;
        if (!contentWrapper) return;

        const handleScroll = (e: Event) => {
            lastScrollPosition.current = (e.target as HTMLDivElement).scrollTop;
        };

        contentWrapper.addEventListener('scroll', handleScroll);
        
        return () => {
            contentWrapper.removeEventListener('scroll', handleScroll);
        };
    }, [simpleBar]);



    // smooth scroll
    const lastSmoothScrollValueRef = useRef(0);
    const smoothScrollSpring = useSpringValue (0, {
        config: {
            duration: 1500,
            easing: easings.linear,
        },
        onRest({ value }) {
            lastSmoothScrollValueRef.current = value;
        },
    });

    const smoothScroll = useCallback(() => {
        const content = simpleBar?.contentEl;
        if (!content) return;

        const contentHeight = content.offsetHeight;

        if (!lastContentHeightRef.current) {
            lastContentHeightRef.current = contentHeight;
            return;
        }

        console.log(`prev: ${lastContentHeightRef.current} \n\n current: ${contentHeight}`);
        
        const differenceInHeight = contentHeight - lastContentHeightRef.current;
        console.log('diff', differenceInHeight);
        if (differenceInHeight <= 0) return;

        const from = differenceInHeight + lastSmoothScrollValueRef.current;
        console.log('from', from);
        
        if (smoothScrollSpring.isAnimating) smoothScrollSpring.stop();
        
        smoothScrollSpring.start({
            from: Math.max(from, 0),
            to: 0,
        });  

        lastContentHeightRef.current = contentHeight;
    }, [simpleBar, smoothScrollSpring]);

    // useSharedResizeObserver(simpleBar?.contentEl, () => {
    // if (!isAutoScrollEnabledRef.current) return;
    //     smoothScroll();
    // });

    useLayoutEffect(() => {
        if (!isAutoScrollEnabledRef.current) return;
        
        // smoothScroll();
    }, [messages, smoothScroll]);

    return {
        setSimpleBar,
        setAutoScrollTriggerElement,
        setPlaceholder,
        indexesShift,
        isAutoScrollEnabled,
        smoothScrollSpring,
    };
};