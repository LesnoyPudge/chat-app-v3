import { deepMerge } from '@reExport';
import { PropsWithChildren, ReactNode, RefObject } from 'react';



export type PropsWithClassName = {
    className?: string;
}

export type PropsWithChildrenAsNodeOrFunction<T> = {
    children?: 
        ReactNode | 
        (
            T extends (...args: never) => ReactNode 
                ? T 
                : (args: T) => ReactNode
        );
};

export type PropsWithChildrenAndClassName = PropsWithChildren & PropsWithClassName;

export interface EncodedFile {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    base64: string;
}

export interface InvalidEncodedFile extends Pick<EncodedFile, 'name' | 'size' | 'type'> {
    reason: 'type' | 'size';
}

export type Alignment = 'top' | 'bottom' | 'left' | 'right';

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export type Merge<T extends object[]> = ReturnType<typeof deepMerge<T>>;

export type PropsWithInnerRef<T extends HTMLElement> = {
    innerRef?: RefObject<T>;
}

export interface Size {
    width: number;
    height: number;
}

export type AnyFunction = (...args: any[]) => any;

export interface ObjectWithId {
    id: string;
    [x: string | number | symbol]: any;
}