import { Alignment } from '@types';
import { RefObject, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { useEventListener, useIsFirstRender } from 'usehooks-ts';
import useResizeObserver from '@react-hook/resize-observer';
// import useIntersectionObserver from '@react-hook/intersection-observer';
import getScrollableParent from 'scrollparent';
// import { throttle } from '@utils';
// import { useThrottle } from '@hooks';
import { fpsToMs, throttle } from '@utils';



interface TargetRect {
    top: number; 
    bottom: number; 
    left: number; 
    right: number;
    width: number;
    height: number;
}

interface WrapperRect {
    width: number;
    height: number;
}

interface GetRelativePositionReturn {
    top: number;
    left: number;
    alignment: Alignment;
}

type GetRelativePositionArgs = {
    boundsSize?: number;
    spacing?: number;
    swappableAlignment?: boolean;
    preferredAlignment: Alignment;
    relativeRect: TargetRect | null;
    absoluteRect: WrapperRect | null;
    centered?: boolean;
}

type GetRelativePosition = (args: GetRelativePositionArgs) => GetRelativePositionReturn;

interface UseRelativePositionArgs {
    preferredAlignment: Alignment;
    relativeElementRef: RefObject<HTMLElement>;
    absoluteElementRef: RefObject<HTMLElement>;
    swappableAlignment?: boolean;
    boundsSize?: number;
    spacing?: number;
    centered?: boolean;
    dependencyList?: unknown[]
}

interface UseRelativePositionReturn extends GetRelativePositionReturn {
    isRelativeElementVisible: boolean;
}

export const useRelativePositionV2 = ({
    preferredAlignment,
    relativeElementRef,
    absoluteElementRef,
    swappableAlignment,
    boundsSize,
    spacing,
    centered,
    dependencyList = [],
}: UseRelativePositionArgs) => {
    const [isRelativeInView, setIsRelativeInView] = useState(true);
    const [alignment, setAlignment] = useState(preferredAlignment);
    const isFirstRender = useIsFirstRender();

    useLayoutEffect(() => {
        if (!isFirstRender) return;
        
        const { alignment: newAlignment } = recalculate({
            absoluteElementRef,
            absoluteRect: absoluteElementRef.current?.getBoundingClientRect() || null,
            preferredAlignment,
            relativeRect: relativeElementRef.current?.getBoundingClientRect() || null,
            boundsSize,
            centered,
            spacing,
            swappableAlignment,
        });

        if (alignment !== newAlignment) {
            setAlignment(newAlignment);
        }
    }, [absoluteElementRef, alignment, boundsSize, centered, isFirstRender, preferredAlignment, relativeElementRef, spacing, swappableAlignment]);

    useLayoutEffect(() => {
        if (!relativeElementRef.current || !absoluteElementRef.current) return;

        const relativeElement = relativeElementRef.current;
        const absoluteElement = absoluteElementRef.current;

        const intObs = new IntersectionObserver(([relativeEntry, absoluteEntry]) => {
            if (!relativeEntry || !absoluteEntry) return;

            const { alignment: newAlignment } = recalculate({
                absoluteElementRef,
                absoluteRect: absoluteEntry.boundingClientRect,
                preferredAlignment,
                relativeRect: relativeEntry.boundingClientRect,
                boundsSize,
                centered,
                spacing,
                swappableAlignment,
            });

            if (alignment !== newAlignment) {
                setAlignment(newAlignment);
            }

            if (isRelativeInView !== relativeEntry.isIntersecting) {
                setIsRelativeInView(relativeEntry.isIntersecting);
            }
        });

        const reobserve = throttle(() => {
            intObs.unobserve(relativeElement);
            intObs.unobserve(absoluteElement);

            intObs.observe(relativeElement);
            intObs.observe(absoluteElement);
        }, fpsToMs(60));

        const resObs = new ResizeObserver(reobserve);

        intObs.observe(relativeElement);
        intObs.observe(absoluteElement);
 
        resObs.observe(relativeElement);
        resObs.observe(absoluteElement);

        const scrollableParent = getScrollableParent(relativeElement);

        scrollableParent && scrollableParent.addEventListener('scroll', reobserve);

        return () => {
            scrollableParent && scrollableParent.removeEventListener('scroll', reobserve);
            
            intObs.disconnect();
            resObs.disconnect();
        };
    }, [absoluteElementRef, alignment, boundsSize, centered, isRelativeInView, preferredAlignment, relativeElementRef, spacing, swappableAlignment]);

    return {
        isRelativeInView,
        alignment,
    };

    // const relativeElementIntersectionEntity = useIntersectionObserver(relativeElementRef);
    // const absoluteElementIntersectionEntity = useIntersectionObserver(absoluteElementRef);

    // const [relativeRecalculate, { entry: relativeElementIntersectionEntity }] = useIntersectionObserver();
    // const [absoluteRecalculate, { entry: absoluteElementIntersectionEntity }] = useIntersectionObserver();

    // useEffect(() => {
    //     if (relativeElementIntersectionEntity || absoluteElementIntersectionEntity) return;

    //     relativeRecalculate(relativeElementRef.current);
    //     absoluteRecalculate(absoluteElementRef.current);
    // }, [
    //     absoluteElementIntersectionEntity, absoluteElementRef, absoluteRecalculate, 
    //     relativeElementIntersectionEntity, relativeElementRef, relativeRecalculate,
    // ]);
    
    // const recalculateOnUpdate = useCallback(() => throttle(() => {
    //     if (isFirstRender) return;

    //     relativeRecalculate(relativeElementRef.current);
    //     absoluteRecalculate(absoluteElementRef.current);
    // }, fpsToMs(30))(), [absoluteElementRef, absoluteRecalculate, isFirstRender, relativeElementRef, relativeRecalculate, throttle]);

    // useResizeObserver(relativeElementRef, recalculateOnUpdate);
    // useResizeObserver(absoluteElementRef, recalculateOnUpdate);

    // useEffect(() => {
    //     if (!relativeElementRef.current) return;

    //     const scrollableParent = getScrollableParent(relativeElementRef.current);
        
    //     if (!scrollableParent) return;

    //     scrollableParent.addEventListener('scroll', recalculateOnUpdate);

    //     return () => {
    //         scrollableParent.removeEventListener('scroll', recalculateOnUpdate);
    //     };
    // }, [recalculateOnUpdate, relativeElementRef]);

    // useEffect(() => {
    //     console.log(relativeElementIntersectionEntity?.boundingClientRect, absoluteElementIntersectionEntity?.boundingClientRect);
    // }, [absoluteElementIntersectionEntity?.boundingClientRect, relativeElementIntersectionEntity?.boundingClientRect]);

    // return {
    // isRelativeElementVisible: relativeElementIntersectionEntity?.isIntersecting || false,
    // ...getRelativePosition({
    //     preferredAlignment,
    //     relativeRect: relativeElementIntersectionEntity?.boundingClientRect || null,
    //     absoluteRect: absoluteElementIntersectionEntity?.boundingClientRect || null,
    //     swappableAlignment,
    //     boundsSize,
    //     spacing,
    //     centered,
    // }),
    // };
};

const recalculate = ({
    preferredAlignment,
    relativeRect,
    absoluteRect,
    boundsSize,
    centered,
    spacing,
    swappableAlignment,
    absoluteElementRef,
}: GetRelativePositionArgs & {absoluteElementRef: RefObject<HTMLElement>}) => {
    const { alignment, left, top } = getRelativePosition({
        preferredAlignment,
        relativeRect,
        absoluteRect,
        swappableAlignment,
        boundsSize,
        spacing,
        centered,
    });
    
    if (absoluteElementRef.current) {
        const absoluteElement = absoluteElementRef.current;
        absoluteElement.style.top = top + 'px';
        absoluteElement.style.left = left + 'px';
    }

    return {
        alignment,
    };
};

const getRelativePosition: GetRelativePosition = ({
    boundsSize = 0,
    spacing = 0,
    swappableAlignment = false,
    preferredAlignment,
    relativeRect,
    absoluteRect,
    centered = false,
}) => {
    if (!absoluteRect || !relativeRect) return {
        alignment: preferredAlignment,
        left: boundsSize,
        top: boundsSize,
    };

    const centering = {
        vertical: (
            centered 
                ? (absoluteRect.height - relativeRect.height) / 2 
                : 0
        ),
        horizontal: (
            centered 
                ? (absoluteRect.width - relativeRect.width) / 2 
                : 0
        ),
    };

    const bounds = {
        top: boundsSize,
        bottom: window.innerHeight - boundsSize - absoluteRect.height,
        left: boundsSize,
        right: window.innerWidth - boundsSize - absoluteRect.width,
    };

    const unboundedPositions = {
        top: {
            top: relativeRect.top - absoluteRect.height - spacing,
            left: relativeRect.left - centering.horizontal,
        },
        bottom: {
            top: relativeRect.bottom + spacing,
            left: relativeRect.left - centering.horizontal,
        },
        left: {
            top: relativeRect.top - centering.vertical,
            left: relativeRect.left - absoluteRect.width - spacing,
        },
        right: {
            top: relativeRect.top - centering.vertical,
            left: relativeRect.right + spacing,
        },
    };

    const positionsInBounds = () => {
        const { top, bottom, left, right } = unboundedPositions;

        return {
            top: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, top.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, top.left)),
            },
            bottom: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, bottom.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, bottom.left)),
            },
            left: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, left.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, left.left)),
            },
            right: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, right.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, right.left)),
            },
        };
    };

    const getAvailableAlignments = () => {
        return {
            top: unboundedPositions.top.top > bounds.top,
            bottom: unboundedPositions.bottom.top < bounds.bottom,
            left: unboundedPositions.left.left > bounds.left,
            right: unboundedPositions.right.left < bounds.right,
        };
    };

    const positions = positionsInBounds();
    
    const defaultResult: GetRelativePositionReturn = {
        ...positions[preferredAlignment],
        alignment: preferredAlignment,
    };

    if (!swappableAlignment) return defaultResult;

    const availableAlignments = getAvailableAlignments();

    if (availableAlignments[preferredAlignment]) return defaultResult;

    const noSpaceAvailable = (
        !availableAlignments.top && 
        !availableAlignments.bottom && 
        !availableAlignments.left && 
        !availableAlignments.right
    );

    if (noSpaceAvailable) return defaultResult;

    const topResult: GetRelativePositionReturn = {
        alignment: 'top',
        ...positions.top,
    };
    const bottomResult: GetRelativePositionReturn = {
        alignment: 'bottom',
        ...positions.bottom,
    };
    const leftResult: GetRelativePositionReturn = {
        alignment: 'left',
        ...positions.left,
    };
    const rightResult: GetRelativePositionReturn = {
        alignment: 'right',
        ...positions.right,
    };
    
    const alternativeAlignmentOptions = {
        top: (
            (availableAlignments.bottom && bottomResult) || 
            (availableAlignments.left && leftResult) || 
            (availableAlignments.right && rightResult) || 
            topResult
        ),
        bottom: (
            (availableAlignments.top && topResult) ||
            (availableAlignments.left && leftResult) || 
            (availableAlignments.right && rightResult) || 
            bottomResult
        ),
        left: (
            (availableAlignments.right && rightResult) ||
            (availableAlignments.top && topResult) || 
            (availableAlignments.bottom && bottomResult) || 
            leftResult
        ),
        right: (
            (availableAlignments.left && leftResult) ||
            (availableAlignments.top && topResult) || 
            (availableAlignments.bottom && bottomResult) || 
            rightResult
        ),
    };

    return alternativeAlignmentOptions[preferredAlignment];
};