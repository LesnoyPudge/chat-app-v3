import { FC, PropsWithChildren } from 'react';



interface IConditional extends PropsWithChildren {
    isRendered: boolean;
}

export const Conditional: FC<IConditional> = ({
    isRendered = true,
    children,
}) => {
    return <>{isRendered ? children : null}</>;
};