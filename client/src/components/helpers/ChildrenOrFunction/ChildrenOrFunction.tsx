import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC } from 'react';



interface IChildrenAsNodeOrFunction extends PropsWithChildrenAsNodeOrFunction {
    args: any;
}

export const ChildrenAsNodeOrFunction: FC<IChildrenAsNodeOrFunction> = ({
    args,
    children,
}) => {
    const content = children instanceof Function 
        ? children(args) 
        : children;
    
    return <>{content}</>;
};