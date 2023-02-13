import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC, ReactNode } from 'react';



interface IChildrenAsNodeOrFunction extends PropsWithChildrenAsNodeOrFunction<any> {
    args: any;
}

export const ChildrenAsNodeOrFunction: FC<IChildrenAsNodeOrFunction> = ({
    args,
    children,
}) => {
    const content = children instanceof Function 
        ? Array.isArray(args) 
            ? children(...args)
            : children(args) 
        : children;
    
    return (
        <>{content}</>
    );
};