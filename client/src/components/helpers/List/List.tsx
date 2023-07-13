import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { isObjectWithId } from '@typeGuards';



type ChildrenArgs<T> = [item: T, index: number, array: T[]];

interface List<T> extends PropsWithChildrenAsNodeOrFunction<ChildrenArgs<T>> {
    list: T[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const List = <T,>({
    list,
    children,
}: List<T>) => {
    return (
        <>
            {list.map((item, index, array) => {
                const key = isObjectWithId(item) ? item.id : index;
                const childrenArgs: ChildrenArgs<T> = [item, index, array];

                return (
                    <ChildrenAsNodeOrFunction
                        args={childrenArgs}
                        key={key}
                    >
                        {children}
                    </ChildrenAsNodeOrFunction>
                );
            })}
        </>
    );
};