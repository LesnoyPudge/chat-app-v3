import { FC, PropsWithChildren, useEffect } from 'react';



interface IEscapeBlock extends PropsWithChildren {
    isOpen: boolean;
    update: (isBlocked: boolean) => void;
}

export const EscapeBlock: FC<IEscapeBlock> = ({
    children,
    isOpen,
    update,
}) => {
    useEffect(() => {
        update(isOpen);
    }, [isOpen, update]);
    
    return <>{children}</>;
};