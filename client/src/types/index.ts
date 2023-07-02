import { deepMerge } from '@reExport';
import { PropsWithChildren, ReactNode, RefObject } from 'react';
import { AnyArray, Entities, StrictOmit, ToType } from '@shared';
import { AnyRecord } from 'ts-essentials/dist/any-record';



export type PropsWithClassName = {
    className?: string;
}

export type PropsWithChildrenAsNodeOrFunction<
    T extends AnyRecord | AnyArray
> = {
    children?: ReactNode | (
        ToType<T> extends Record<string | number, unknown> 
            ? ((arg: T) => ReactNode)
            : T extends AnyArray
                ? ((...args: T) => ReactNode)
                : never
    );
}

export type PropsWithChildrenAndClassName = PropsWithChildren & PropsWithClassName;

export type EncodedFile = Entities.File.Encoded;

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
    innerRef?: RefObject<T> | ((ref: T) => void);
}

export interface Size {
    width: number;
    height: number;
}

export interface ObjectWithId {
    id: string;
    [x: string | number | symbol]: any;
}

export type OmittedRect = StrictOmit<DOMRect, 'x' | 'y' | 'toJSON'>;