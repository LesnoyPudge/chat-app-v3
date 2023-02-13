import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { isObjectWithId } from '@typeGuards';
import { ReactNode } from 'react';





type Children<T> = (item: T, index: number, array: T[]) => ReactNode;

interface List<T> extends PropsWithChildrenAsNodeOrFunction<Children<T>> {
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
                
                return (
                    <ChildrenAsNodeOrFunction 
                        args={[item, index, array]} 
                        key={key}
                    >
                        {children}
                    </ChildrenAsNodeOrFunction>
                );
            })}
        </>
    );
};