import { PropsWithChildren } from 'react';



export type PropsWithClassName = {
    className?: string;
}

export type PropsWithChildrenAndClassName = PropsWithChildren & PropsWithClassName;