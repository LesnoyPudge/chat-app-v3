import { FC, useId } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



interface ChildrenArgs {
    id: string;
}

export const Id: FC<PropsWithChildrenAsNodeOrFunction<ChildrenArgs>> = ({ children }) => {
    const id = useId();

    return (
        <ChildrenAsNodeOrFunction args={{ id }}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};