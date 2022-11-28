import { PropsWithChildren, ReactNode } from 'react';



export type PropsWithClassName = {
    className?: string;
}

export type PropsWithChildrenAndClassName = PropsWithChildren & PropsWithClassName;

export type ChildrenAsFunction<ARGS> = (args: ARGS) => JSX.Element;

export type ChildrenAsNodeOrFunction<ARGS = any> = ChildrenAsFunction<ARGS> | ReactNode;

export type PropsWithChildrenAsNodeOrFunction<ARGS = any> = {
    children: ChildrenAsNodeOrFunction<ARGS>;
}

export type PropsWithChildrenAsFunction<ARGS = any> = {
    children: ChildrenAsFunction<ARGS>;
}

export interface EncodedFile {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    base64: string;
}