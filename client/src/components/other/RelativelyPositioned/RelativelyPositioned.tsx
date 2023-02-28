import { ChildrenAsNodeOrFunction } from '@components';
import { useRelativePosition } from '@hooks';
import { Alignment, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
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

interface RelativelyPositioned extends 
PropsWithClassName, 
PropsWithChildrenAsNodeOrFunction<{alignment: Alignment}> {
    preferredAlignment: Alignment;
    targetRefOrRect?: RefObject<HTMLElement> | TargetRect;
    boundsSize?: number;
    spacing?: number;
    swappableAlignment?: boolean;
    alligmentClassNames?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
    centered?: boolean;
    dependencyList?: unknown[];
}

const defaultAlligmentClassNames = {
    top: '',
    bottom: '',
    left: '',
    right: '',
};

export const RelativelyPositioned: FC<RelativelyPositioned> = ({
    className = '',
    preferredAlignment,
    targetRefOrRect,
    boundsSize = 20,
    spacing = 20,
    swappableAlignment = false,
    alligmentClassNames = defaultAlligmentClassNames,
    centered = false,
    dependencyList,
    children,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { alignment: alignment, left, top } = useRelativePosition({
        preferredAlignment,
        targetRefOrRect,
        wrapperRefOrRect: wrapperRef,
        boundsSize,
        spacing,
        swappableAlignment,
        centered,
        dependencyList,
    });
    
    return (
        <div 
            className={twClassNames('fixed', alligmentClassNames[alignment], className)}
            style={{ top, left }}
            ref={wrapperRef}
        >
            <ChildrenAsNodeOrFunction args={{ alignment }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </div>
    );
};