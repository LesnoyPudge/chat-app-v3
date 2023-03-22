import useResizeObserver from '@react-hook/resize-observer';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import SimpleBarCore from 'simplebar-core';
import { useIsFirstRender } from 'usehooks-ts';



export const useAutoScroll = (deps: unknown[] = []) => {
    const isFirstRender = useIsFirstRender();
    // const [autoScrollTriggerRef, isAutoScrollEnabled] = useInView();
    const simpleBarRef = useRef<SimpleBarCore>(null);
    const resizableWrapperRef = useRef<HTMLDivElement>(null);
    const isAutoScrollEnabledRef = useRef(true);

    const scrollToBottom = () => {
        const contentWrapper = simpleBarRef.current?.contentWrapperEl;
        const content = simpleBarRef.current?.contentEl;
        if (!contentWrapper || !content) return;

        console.log(
            'scrooool', 
            // contentWrapper.scrollTop, 
            // contentWrapper.scrollHeight,
            // contentWrapper,
        );
        contentWrapper.scrollTop = contentWrapper.scrollHeight;
        // content.style.transition = 'all 0s linear';
        // content.style.transform = 'translateY(56px)';
        
        // setTimeout(() => {
        // content.style.transition = 'all 1s linear';
        // content.style.transform = 'translateY(0px)';
            
        // }, 1000);
        // content.style.transform = 'translateY(0px)';
        // contentWrapper.scrollTop = 99999;
        // contentWrapper.scrollTo({
        //     top: contentWrapper.scrollHeight,
        //     behavior: 'smooth',
        // });
    };

    const onLastElementRender = () => {
        console.log('last');

        // if (autoScrollTriggerRef.current) scrollToBottom();
    };

    useLayoutEffect(() => {
        // console.log('added message', isAutoScrollEnabledRef.current);
        if (isAutoScrollEnabledRef.current) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    // useEffect(() => {
    //     isAutoScrollEnabledRef.current = isAutoScrollEnabled;
    // }, [isAutoScrollEnabled]);

    // useResizeObserver(resizableContentRef, () => {
    //     console.log('resize', isAutoScrollEnabledRef.current);
    //     // if (isAutoScrollEnabledRef.current) scrollToBottom();
    // });

    useEffect(() => {
        const content = simpleBarRef.current?.contentEl;

        if (!resizableWrapperRef.current) return;
        if (!content) return;

        

        const obs = new ResizeObserver(() => {
            // console.log('resize obs', isAutoScrollEnabledRef.current);
            if (isAutoScrollEnabledRef.current) scrollToBottom();
        });

        obs.observe(resizableWrapperRef.current);
        obs.observe(content);

        return () => {
            obs.disconnect();
        };
    }, []);

    useLayoutEffect(() => {
        if (isFirstRender) scrollToBottom();
    }, [isFirstRender]);

    // useLayoutEffect(() => {
    //     // console.log(
    //     //     simpleBarRef.current?.contentWrapperEl?.scrollTop,
    //     //     simpleBarRef.current?.contentWrapperEl?.offsetHeight,
    //     //     simpleBarRef.current?.contentWrapperEl?.scrollHeight,
    //     //     simpleBarRef.current?.contentWrapperEl,
    //     // );
    //     // scrollToBottom();
    //     // console.log(
    //     //     simpleBarRef.current?.contentWrapperEl?.scrollTop,
    //     //     simpleBarRef.current?.contentWrapperEl?.offsetHeight,
    //     //     simpleBarRef.current?.contentWrapperEl?.scrollHeight,
    //     //     simpleBarRef.current?.contentWrapperEl,
    //     // );
    //     if (isAutoScrollEnabled) scrollToBottom();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isAutoScrollEnabled]);
    const autoScrollTriggerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!autoScrollTriggerRef.current) return;

        const obs = new IntersectionObserver(([{ isIntersecting }]) => {
            isAutoScrollEnabledRef.current = isIntersecting;
            // console.log('is intersecting', isIntersecting);
        });

        obs.observe(autoScrollTriggerRef.current);

        return () => {
            obs.disconnect();
        };
    }, []);

    // useLayoutEffect(() => {
    //     console.log('layout', isAutoScrollEnabledRef.current);
    //     if (isAutoScrollEnabledRef.current) scrollToBottom();

    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [...deps]);

    


    return {
        simpleBarRef,
        resizableWrapperRef,
        autoScrollTriggerRef,
        onLastElementRender,
    };
};