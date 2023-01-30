import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { FC, useContext } from 'react';
import { ChildrenAsNodeOrFunction, ArrowFocusContext } from '@components';
import { MoveFocusInside } from 'react-focus-lock';



interface ChildrenArgs {
    tabIndex: number;
    isFocused: boolean;
    isFocusable: boolean;
}

interface ArrowFocusItem extends 
PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    id: string | number;
}

export const ArrowFocusItem: FC<ArrowFocusItem> = ({
    className = '',
    id,
    children,
}) => {
    const { focus, handleArrowMove, setFocusable } = useContext(ArrowFocusContext) as ArrowFocusContext;
    
    const normalizedId = id.toString();
    const isFocused = normalizedId === focus.focusedId;
    const isFocusable = normalizedId === focus.focusableId;
    const tabIndex = isFocusable ? 0 : -1;

    const handleFocus = () => setFocusable(normalizedId);

    const childrenArgs: ChildrenArgs = {
        tabIndex,
        isFocused,
        isFocusable,
    };

    return (
        <div
            className={className}
            onFocus={handleFocus}
            onKeyDown={handleArrowMove}
        >
            <MoveFocusInside disabled={!isFocused}>
                <ChildrenAsNodeOrFunction args={childrenArgs}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </MoveFocusInside>
        </div>
    );
};