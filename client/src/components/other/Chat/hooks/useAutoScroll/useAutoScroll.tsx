import useResizeObserver from '@react-hook/resize-observer';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import SimpleBarCore from 'simplebar-core';
import { useIsFirstRender } from 'usehooks-ts';



export const useAutoScroll = () => {
    const isFirstRender = useIsFirstRender();
    // const [autoScrollTriggerRef, isAutoScrollEnabled] = useInView();
    const simpleBarRef = useRef<SimpleBarCore>(null);
    const resizableContentRef = useRef<HTMLDivElement>(null);
    const isAutoScrollEnabledRef = useRef(false);

    const scrollToBottom = () => {
        const contentWrapper = simpleBarRef.current?.contentWrapperEl;
        if (!contentWrapper) return;
        console.log('scroll to bottom');
        contentWrapper.scrollTop = contentWrapper.scrollHeight;
    };

    // useEffect(() => {
    //     isAutoScrollEnabledRef.current = isAutoScrollEnabled;
    // }, [isAutoScrollEnabled]);

    // useResizeObserver(resizableContentRef, () => {
    //     console.log('resize', isAutoScrollEnabledRef.current);
    //     // if (isAutoScrollEnabledRef.current) scrollToBottom();
    // });

    useEffect(() => {
        if (!resizableContentRef.current) return;

        const obs = new ResizeObserver(() => {
            console.log('resize obs');
            if (isAutoScrollEnabledRef.current) scrollToBottom();
        });

        obs.observe(resizableContentRef.current);

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
            console.log('is intersecting', isIntersecting);
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
        resizableContentRef,
        autoScrollTriggerRef,
    };
};