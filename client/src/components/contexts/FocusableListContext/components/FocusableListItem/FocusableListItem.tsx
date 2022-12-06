import { FC, useContext, useEffect, useMemo } from 'react';
import { MoveFocusInside } from 'react-focus-lock';
import { FocusableListContext, IFocusableListContext, ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



interface IFocusableListItem extends PropsWithChildrenAsNodeOrFunction<{tabIndex: number}> {
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
            <ChildrenAsNodeOrFunction
                args={{ tabIndex }}
            >
                {children}
            </ChildrenAsNodeOrFunction>
        </MoveFocusInside>
    ), [children, isAutoFocusDisabled, tabIndex]);
};