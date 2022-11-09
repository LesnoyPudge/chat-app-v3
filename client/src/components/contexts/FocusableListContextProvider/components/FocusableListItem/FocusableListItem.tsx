import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { MoveFocusInside } from 'react-focus-lock';
import { FocusableListContext, IFocusableListContext, PropsWithChildrenOrFunction, ChildrenOrFunction } from '@components';



interface IFocusableListItem extends PropsWithChildrenOrFunction<{tabIndex: number}> {
    index: number;
}

export const FocusableListItem: FC<IFocusableListItem> = ({ 
    index,
    children,
}) => {
    const { listItemLifeCycle, getTabIndex } = useContext(FocusableListContext) as IFocusableListContext;
    const tabIndex = getTabIndex(index);
    const isAutoFocusDisabled = tabIndex === -1;

    useEffect(() => {
        listItemLifeCycle.onMount();

        return () => {
            listItemLifeCycle.onUnmount();
        };
    }, [listItemLifeCycle]);

    return useMemo(() => (
        <MoveFocusInside disabled={isAutoFocusDisabled}>
            <ChildrenOrFunction childrenOrFunction={children} args={{ tabIndex }}/>
        </MoveFocusInside>
    ), [children, isAutoFocusDisabled, tabIndex]);
};