import { useRelativePosition } from '@hooks';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, RefObject, useRef } from 'react';



interface TargetRect {
    top: number; 
    bottom: number; 
    left: number; 
    right: number;
    width: number;
    height: number;
}

interface RelativelyPositioned extends PropsWithChildrenAndClassName {
    preferredAligment: 'top' | 'bottom' | 'left' | 'right';
    targetRefOrRect: RefObject<HTMLElement> | TargetRect;
    boundsSize?: number;
    spacing?: number;
    swapableAligment?: boolean;
    alligmentStyles?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
    centered?: boolean;
}

const defaultAligmentStyles = {
    top: '',
    bottom: '',
    left: '',
    right: '',
};

export const RelativelyPositioned: FC<RelativelyPositioned> = ({
    className = '',
    preferredAligment,
    targetRefOrRect,
    boundsSize,
    spacing,
    swapableAligment,
    alligmentStyles = defaultAligmentStyles,
    centered,
    children,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { aligment, left, top } = useRelativePosition({
        preferredAligment,
        targetRefOrRect,
        wrapperRefOrRect: wrapperRef,
        boundsSize,
        spacing,
        swapableAligment,
        centered,
    });

    return (
        <div 
            className={twClassNames('fixed', alligmentStyles[aligment], className)}
            style={{ top, left }}
            ref={wrapperRef}
        >
            {children}
        </div>
    );
};