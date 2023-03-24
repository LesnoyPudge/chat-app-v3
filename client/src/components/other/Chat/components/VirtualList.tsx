import { FC } from 'react';
import { ViewportList, ViewportListPropsBase, ViewportListPropsWithItems } from 'react-viewport-list';



interface VirtualListProps<T> extends ViewportListPropsWithItems<T> {
    s?: string;
}

export const VirtualList = <T,>(props: VirtualListProps<T>) => {
    return (
        <ViewportList 
            {...props}
            indexesShift={1}
        >
            {props.children}
        </ViewportList>
    );
};