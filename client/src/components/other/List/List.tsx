import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { isObjectWithId } from '@typeGuards';



interface List<T> extends PropsWithChildrenAsNodeOrFunction<[item: T, index: number, array: T[]]> {
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