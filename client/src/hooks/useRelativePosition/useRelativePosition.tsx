import { RefObject, useCallback, useLayoutEffect, useState } from 'react';
import { useResizeObserver } from '@hooks';
import { isRef } from '@typeGuards';
import { Alignment } from '@types';
import { useWindowSize } from 'usehooks-ts';



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
    aligment: Alignment;
}

type GetRelativePosition = (args: {
    boundsSize?: number;
    spacing?: number;
    swappableAlignment?: boolean;
    preferredAlignment: Alignment;
    targetRect: TargetRect;
    wrapperRect: WrapperRect;
    centered?: boolean;
}) => GetRelativePositionReturn;

interface UseRelativePositionArgs {
    preferredAlignment: Alignment;
    targetRefOrRect?: RefObject<HTMLElement> | TargetRect;
    wrapperRefOrRect?: RefObject<HTMLElement> | WrapperRect;
    swappableAlignment?: boolean;
    boundsSize?: number;
    spacing?: number;
    centered?: boolean;
    dependencyList?: unknown[]
}

export const useRelativePosition = ({
    preferredAlignment,
    targetRefOrRect,
    wrapperRefOrRect,
    swappableAlignment,
    boundsSize,
    spacing,
    centered,
    dependencyList = [],
}: UseRelativePositionArgs) => {
    const windowSize = useWindowSize();
    const [position, setPosition] = useState<GetRelativePositionReturn>({ 
        top: boundsSize || 0, 
        left: boundsSize || 0, 
        aligment: preferredAlignment, 
    });

    const setNewPosition = useCallback(() => {
        if (!targetRefOrRect) return;
        if (!wrapperRefOrRect) return;
        if (isRef(targetRefOrRect) && !targetRefOrRect.current) return;
        if (isRef(wrapperRefOrRect) && !wrapperRefOrRect.current) return;
        
        const targetRect = (
            isRef(targetRefOrRect) 
                ? targetRefOrRect.current!.getBoundingClientRect() 
                : targetRefOrRect
        );
        const wrapperRect = (
            isRef(wrapperRefOrRect) 
                ? wrapperRefOrRect.current!.getBoundingClientRect() 
                : wrapperRefOrRect
        );
        
        const newPosition = getRelativePosition({
            preferredAlignment,
            targetRect,
            wrapperRect,
            boundsSize,
            spacing,
            swappableAlignment,
            centered,
        });

        setPosition(newPosition);
    }, [
        boundsSize, centered, preferredAlignment, 
        spacing, swappableAlignment, targetRefOrRect, 
        wrapperRefOrRect,
    ]);

    const resizeableWrapper = isRef(wrapperRefOrRect) ? wrapperRefOrRect.current : null;
    useResizeObserver(resizeableWrapper, setNewPosition);

    const resizeableTarget = isRef(targetRefOrRect) ? targetRefOrRect.current : null;
    useResizeObserver(resizeableTarget, setNewPosition);

    useLayoutEffect(() => setNewPosition(), [
        setNewPosition, windowSize,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...dependencyList,
    ]);

    return position;
};

const getRelativePosition: GetRelativePosition = ({
    boundsSize = 0,
    spacing = 0,
    swappableAlignment = false,
    preferredAlignment,
    targetRect,
    wrapperRect,
    centered = false,
}) => {
    const centering = {
        vertical: (
            centered 
                ? (wrapperRect.height - targetRect.height) / 2 
                : 0
        ),
        horizontal: (
            centered 
                ? (wrapperRect.width - targetRect.width) / 2 
                : 0
        ),
    };

    const bounds = {
        top: boundsSize,
        bottom: window.innerHeight - boundsSize - wrapperRect.height,
        left: boundsSize,
        right: window.innerWidth - boundsSize - wrapperRect.width,
    };

    const unboundedPositions = {
        top: {
            top: targetRect.top - wrapperRect.height - spacing,
            left: targetRect.left - centering.horizontal,
        },
        bottom: {
            top: targetRect.bottom + spacing,
            left: targetRect.left - centering.horizontal,
        },
        left: {
            top: targetRect.top - centering.vertical,
            left: targetRect.left - wrapperRect.width - spacing,
        },
        right: {
            top: targetRect.top - centering.vertical,
            left: targetRect.right + spacing,
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
        aligment: preferredAlignment,
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
        aligment: 'top',
        ...positions.top,
    };
    const bottomResult: GetRelativePositionReturn = {
        aligment: 'bottom',
        ...positions.bottom,
    };
    const leftResult: GetRelativePositionReturn = {
        aligment: 'left',
        ...positions.left,
    };
    const rightResult: GetRelativePositionReturn = {
        aligment: 'right',
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