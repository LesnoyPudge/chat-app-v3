import { FC, ReactNode, useMemo } from 'react';



export type ChildrenOrFunction<ARGS = any> = ((args: ARGS) => JSX.Element) | ReactNode;

export type PropsWithChildrenOrFunction<ARGS = any> = {
    children: ChildrenOrFunction<ARGS>;
}

interface IChildrenOrFunction {
    childrenOrFunction: ChildrenOrFunction;
    args: any;
}

export const ChildrenOrFunction: FC<IChildrenOrFunction> = ({
    childrenOrFunction,
    args,
}) => {
    const children = useMemo(() => (
        childrenOrFunction instanceof Function 
            ? childrenOrFunction(args) 
            : childrenOrFunction
    ), [args, childrenOrFunction]);
    
    return <>{children}</>;
};