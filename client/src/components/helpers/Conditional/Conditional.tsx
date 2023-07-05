import { FC, PropsWithChildren } from 'react';



interface Conditional extends PropsWithChildren {
    isRendered: boolean;
}

export const Conditional: FC<Conditional> = ({
    isRendered = true,
    children,
}) => {
    return <>{isRendered ? children : null}</>;
};