import isCallable from 'is-callable';
import { AnyArray, Primitive, ToType } from '@shared';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { AnyRecord } from 'ts-essentials/dist/any-record';



type ChildrenAsNodeOrFunction<
    T extends Primitive | AnyRecord | AnyArray
> = PropsWithChildrenAsNodeOrFunction<T> & {
    args: T;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ChildrenAsNodeOrFunction = <T extends Primitive | AnyRecord | AnyArray>({
    args,
    children,
}: ChildrenAsNodeOrFunction<T>) => {
    const childrenNode = (
        isCallable(children)
            ? Array.isArray(args)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ? children(...args)
                : children(args)
            : children
    );

    return (
        <>{childrenNode}</>
    );
};