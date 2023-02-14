import { FC, useId } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



export const Id: FC<PropsWithChildrenAsNodeOrFunction<string>> = ({ children }) => {
    const id = useId();

    return (
        <ChildrenAsNodeOrFunction args={id}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};