import { useAnimationFrame } from '@hooks';
import { isOmittedRect } from '@typeGuards';
import { Alignment, OmittedRect } from '@types';
import { RefObject, useLayoutEffect, useState } from 'react';
import { useIsFirstRender } from 'usehooks-ts';



export interface WithAlignment {
    alignment: Alignment;
}

interface Position {
    top: number;
    left: number;
}

export interface RelativePositionOptions {
    preferredAlignment: Alignment;
    swappableAlignment?: boolean;
    boundsSize?: number;
    spacing?: number;
    centered?: boolean;
    unbounded?: boolean;
}

interface WithRects {
    followerRect: OmittedRect;
    leaderRect: OmittedRect;
}

export interface UseRelativePositionArgs extends RelativePositionOptions {
    followerElementRef: RefObject<HTMLElement>;
    leaderElementOrRectRef: RefObject<HTMLElement | OmittedRect>;
}

export const useRelativePosition = ({
    preferredAlignment,
    followerElementRef,
    leaderElementOrRectRef,
    swappableAlignment = false,
    boundsSize = 0,
    spacing = 0,
    centered = false,
    unbounded = false,
}: UseRelativePositionArgs): WithAlignment => {
    const [alignment, setAlignment] = useState(preferredAlignment);
    const isFirstRender = useIsFirstRender()
    
    const calculate = () => {
        if (!followerElementRef.current || !leaderElementOrRectRef.current) return;

        const leaderRect = (
            isOmittedRect(leaderElementOrRectRef.current)
                ? leaderElementOrRectRef.current
                : leaderElementOrRectRef.current.getBoundingClientRect()
        );

        const { alignment: newAlignment, left, top } = calculateRelativePosition({
            followerRect: followerElementRef.current.getBoundingClientRect(),
            leaderRect: leaderRect,
            boundsSize,
            centered,
            preferredAlignment,
            spacing,
            swappableAlignment,
            unbounded,
        });

        if (alignment !== newAlignment) setAlignment(newAlignment);

        const follower = followerElementRef.current;
        const transformValue = `translate(${left}px, ${top}px)`;

        if (follower.style.transform === transformValue) return;

        follower.style.transform = transformValue;
    };

    useLayoutEffect(() => {
        if (!isFirstRender) return;

        calculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useAnimationFrame(calculate);

    return {
        alignment,
    };
};

const calculateRelativePosition = ({
    followerRect,
    leaderRect,
    preferredAlignment,
    boundsSize,
    centered,
    spacing,
    swappableAlignment,
    unbounded,
}: Required<RelativePositionOptions> & WithRects): Position & WithAlignment => {
    const centering = {
        vertical: (
            centered
                ? (followerRect.height - leaderRect.height) / 2
                : 0
        ),
        horizontal: (
            centered
                ? (followerRect.width - leaderRect.width) / 2
                : 0
        ),
    };

    const bounds = {
        top: unbounded ? -9999 : boundsSize,
        bottom: unbounded ? 9999 : window.innerHeight - boundsSize - followerRect.height,
        left: unbounded ? -9999 : boundsSize,
        right: unbounded ? 9999 : window.innerWidth - boundsSize - followerRect.width,
    };

    const unboundedPositions = {
        top: {
            top: leaderRect.top - followerRect.height - spacing,
            left: leaderRect.left - centering.horizontal,
        },
        bottom: {
            top: leaderRect.bottom + spacing,
            left: leaderRect.left - centering.horizontal,
        },
        left: {
            top: leaderRect.top - centering.vertical,
            left: leaderRect.left - followerRect.width - spacing,
        },
        right: {
            top: leaderRect.top - centering.vertical,
            left: leaderRect.right + spacing,
        },
    };

    const positions = {
        top: {
            top: Math.max(bounds.top, Math.min(bounds.bottom, unboundedPositions.top.top)),
            left: Math.max(bounds.left, Math.min(bounds.right, unboundedPositions.top.left)),
        },
        bottom: {
            top: Math.max(bounds.top, Math.min(bounds.bottom, unboundedPositions.bottom.top)),
            left: Math.max(bounds.left, Math.min(bounds.right, unboundedPositions.bottom.left)),
        },
        left: {
            top: Math.max(bounds.top, Math.min(bounds.bottom, unboundedPositions.left.top)),
            left: Math.max(bounds.left, Math.min(bounds.right, unboundedPositions.left.left)),
        },
        right: {
            top: Math.max(bounds.top, Math.min(bounds.bottom, unboundedPositions.right.top)),
            left: Math.max(bounds.left, Math.min(bounds.right, unboundedPositions.right.left)),
        },
    };

    const defaultResult: Position & WithAlignment = {
        ...positions[preferredAlignment],
        alignment: preferredAlignment,
    };

    if (!swappableAlignment) return defaultResult;

    const availableAlignments = {
        top: unboundedPositions.top.top > bounds.top,
        bottom: unboundedPositions.bottom.top < bounds.bottom,
        left: unboundedPositions.left.left > bounds.left,
        right: unboundedPositions.right.left < bounds.right,
    };

    if (availableAlignments[preferredAlignment]) return defaultResult;

    const noSpaceAvailable = (
        !availableAlignments.top &&
        !availableAlignments.bottom &&
        !availableAlignments.left &&
        !availableAlignments.right
    );

    if (noSpaceAvailable) return defaultResult;

    const topResult: Position & WithAlignment = {
        alignment: 'top',
        ...positions.top,
    };
    const bottomResult: Position & WithAlignment = {
        alignment: 'bottom',
        ...positions.bottom,
    };
    const leftResult: Position & WithAlignment = {
        alignment: 'left',
        ...positions.left,
    };
    const rightResult: Position & WithAlignment = {
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