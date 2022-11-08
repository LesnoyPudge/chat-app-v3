import { FC, useContext, useEffect } from 'react';
import { MoveFocusInside } from 'react-focus-lock';
import { FocusableListContext, IFocusableListContext, PropsWithChildrenOrFunction, ChildrenOrFunction } from '@components';



interface IFocusableListItem extends PropsWithChildrenOrFunction<{tabIndex: number}> {
    index: number;
}

export const FocusableListItem: FC<IFocusableListItem> = ({ 
    index,
    children,
}) => {
    const { currentFocus, listItemLifeCycle } = useContext(FocusableListContext) as IFocusableListContext;
    const tabIndex = currentFocus === index ? 0 : -1;
    const isAutoFocusDisabled = currentFocus !== index;

    useEffect(() => {
        listItemLifeCycle.add();

        return () => {
            listItemLifeCycle.remove();
        };
    }, [listItemLifeCycle]);

    return (
        <MoveFocusInside disabled={isAutoFocusDisabled}>
            <ChildrenOrFunction childrenOrFunction={children} args={{ tabIndex }}/>
        </MoveFocusInside>
    );
};