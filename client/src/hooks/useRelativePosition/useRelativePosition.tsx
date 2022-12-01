import { RefObject, useCallback, useEffect, useState } from 'react';
import { useWindowSize } from '@hooks';
import { isRef } from '@utils';



interface TargetRect {
    top: number; 
    bottom: number; 
    left: number; 
    right: number;
}

interface WrapperRect {
    width: number;
    height: number;
}

type GetRelativePosition = (args: {
    boundsSize?: number;
    spacing?: number;
    swapableAligment?: boolean;
    preferredAligment: 'top' | 'bottom' | 'left' | 'right';
    targetRect: TargetRect;
    wrapperRect: WrapperRect;
}) => {
    top: number;
    left: number;
}

interface UseRelativePositionArgs {
    preferredAligment: 'top' | 'bottom' | 'left' | 'right';
    targetRefOrRect: RefObject<HTMLElement> | TargetRect;
    wrapperRefOrRect: RefObject<HTMLElement> | WrapperRect;
    swapableAligment?: boolean;
    boundsSize?: number;
    spacing?: number;
}

export const useRelativePosition = ({
    preferredAligment,
    targetRefOrRect,
    wrapperRefOrRect,
    swapableAligment = false,
    boundsSize,
    spacing,
}: UseRelativePositionArgs) => {
    const [position, setPosition] = useState({ top: boundsSize, left: boundsSize });
    const windowSize = useWindowSize();

    const getRelativePosition: GetRelativePosition = useCallback(({
        boundsSize = 0,
        spacing = 0,
        swapableAligment = false,
        preferredAligment,
        targetRect,
        wrapperRect,
    }) => {
        const bounds = {
            top: boundsSize,
            bottom: window.innerHeight - boundsSize,
            left: boundsSize,
            right: window.innerWidth - boundsSize,
        };

        const getAvailableAligments = () => {
            return {
                top: (targetRect.top - bounds.top - spacing) >= wrapperRect.height,
                bottom: (bounds.bottom - targetRect.bottom - spacing) >= wrapperRect.height,
                left: (targetRect.left - bounds.left - spacing) >= wrapperRect.width,
                right: (bounds.right - targetRect.right - spacing) >= wrapperRect.width,
            };
        };

        const getPositions = () => {
            return {
                top: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.top - wrapperRect.height - spacing)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left)),
                },
                bottom: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.bottom + spacing)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left)),
                },
                left: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.top)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.left - wrapperRect.width - spacing)),
                },
                right: {
                    top: Math.max(bounds.top, Math.min(bounds.bottom - wrapperRect.height, targetRect.top)),
                    left: Math.min(bounds.right - wrapperRect.width, Math.max(bounds.left, targetRect.right + spacing)),
                },
            };
        };

        const positions = getPositions();

        if (!swapableAligment) return positions[preferredAligment];

        const availableAligments = getAvailableAligments();

        if (availableAligments[preferredAligment]) return positions[preferredAligment];

        const noSpaceAvailable = (
            !availableAligments.top && 
            !availableAligments.bottom && 
            !availableAligments.left && 
            !availableAligments.right
        );

        if (noSpaceAvailable) return positions[preferredAligment];
        
        const alternativeAlignmentOptions = {
            top: (
                (availableAligments.bottom && positions.bottom) || 
                (availableAligments.left && positions.left) || 
                (availableAligments.right && positions.right) || 
                positions[preferredAligment]
            ),
            bottom: (
                (availableAligments.top && positions.top) ||
                (availableAligments.left && positions.left) || 
                (availableAligments.right && positions.right) || 
                positions[preferredAligment]
            ),
            left: (
                (availableAligments.right && positions.right) ||
                (availableAligments.top && positions.top) || 
                (availableAligments.bottom && positions.bottom) || 
                positions[preferredAligment]
            ),
            right: (
                (availableAligments.left && positions.left) ||
                (availableAligments.top && positions.top) || 
                (availableAligments.bottom && positions.bottom) || 
                positions[preferredAligment]
            ),
        };

        return alternativeAlignmentOptions[preferredAligment];
    }, []);

    useEffect(() => {
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
            preferredAligment,
            targetRect,
            wrapperRect,
            boundsSize,
            spacing,
            swapableAligment,
        });

        setPosition(newPosition);
    }, [
        boundsSize, getRelativePosition, 
        preferredAligment, spacing, 
        swapableAligment, targetRefOrRect, 
        wrapperRefOrRect, windowSize,
    ]);

    return position;
};