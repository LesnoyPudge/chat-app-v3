import { useRelativePosition } from '@hooks';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, RefObject, useEffect, useRef } from 'react';



interface TargetRect {
    top: number; 
    bottom: number; 
    left: number; 
    right: number;
}

interface RelativelyPositioned extends PropsWithChildrenAndClassName {
    preferredAligment: 'top' | 'bottom' | 'left' | 'right';
    targetRefOrRect: RefObject<HTMLElement> | TargetRect;
    boundsSize?: number;
    spacing?: number;
    swapableAligment?: boolean;
}

export const RelativelyPositioned: FC<RelativelyPositioned> = ({
    className = '',
    preferredAligment,
    targetRefOrRect,
    boundsSize,
    spacing,
    swapableAligment,
    children,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const position = useRelativePosition({
        preferredAligment,
        targetRefOrRect,
        wrapperRefOrRect: wrapperRef,
        boundsSize,
        spacing,
        swapableAligment,
    });

    return (
        <div 
            className={twClassNames('fixed', className)}
            style={position}
            ref={wrapperRef}
        >
            {children}
        </div>
    );
};