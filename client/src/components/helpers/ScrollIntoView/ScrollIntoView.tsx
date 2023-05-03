import { useRefWithSetter } from '@hooks';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC, useEffect } from 'react';
import { useLatest } from 'react-use';
import { ChildrenAsNodeOrFunction } from '@components';



interface ChildrenArgs {
    setChildrenRef: (node: HTMLElement | null) => void;
}

interface ScrollIntoView extends PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    isEnabled: boolean;
    options: ScrollIntoViewOptions;
}

export const ScrollIntoView: FC<ScrollIntoView> = ({ 
    children, 
    isEnabled,
    options,
}) => {
    const [childrenRef, setChildrenRef] = useRefWithSetter<HTMLElement | null>(null);
    const optionsRef = useLatest(options);

    useEffect(() => {
        if (!isEnabled) return;
        if (!childrenRef.current) return;

        childrenRef.current.scrollIntoView(optionsRef.current);
    }, [isEnabled, childrenRef, optionsRef]);

    const childrenArgs: ChildrenArgs = {
        setChildrenRef,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};