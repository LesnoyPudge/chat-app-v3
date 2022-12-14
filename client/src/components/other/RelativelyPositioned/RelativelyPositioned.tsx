import { ChildrenAsNodeOrFunction } from '@components';
import { useRelativePosition } from '@hooks';
import { Aligment, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
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
PropsWithChildrenAsNodeOrFunction<{aligment: Aligment}> {
    preferredAligment: Aligment;
    targetRefOrRect?: RefObject<HTMLElement> | TargetRect;
    boundsSize?: number;
    spacing?: number;
    swapableAligment?: boolean;
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
    preferredAligment,
    targetRefOrRect,
    boundsSize = 20,
    spacing = 20,
    swapableAligment = false,
    alligmentClassNames = defaultAlligmentClassNames,
    centered = false,
    dependencyList,
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
        dependencyList,
    });
    
    return (
        <div 
            className={twClassNames('fixed', alligmentClassNames[aligment], className)}
            style={{ top, left }}
            ref={wrapperRef}
        >
            <ChildrenAsNodeOrFunction args={{ aligment }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </div>
    );
};