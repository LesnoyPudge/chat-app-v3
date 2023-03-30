// import { ViewportList, ViewportListPropsBase, ViewportListPropsWithItems } from 'react-viewport-list';
import { ViewportList, ViewportListPropsBase, ViewportListPropsWithItems } from './tmp';



type VirtualListProps<T> = ViewportListPropsWithItems<T>

export const VirtualList = <T,>({
    ...props
}: VirtualListProps<T>) => {
    return (
        <ViewportList {...props}>
            {props.children}
        </ViewportList>
    );
};