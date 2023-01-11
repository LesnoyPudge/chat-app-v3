import { Conditional } from '@components';
import { FC, PropsWithChildren } from 'react';



interface Playground extends PropsWithChildren {
    enabled?: boolean;
}

const PlaygroundInner: FC = () => {
    return (
        <>
            
        </>
    );
};

export const Playground: FC<Playground> = ({ 
    enabled = false,
    children,
}) => {
    return (
        <>
            <Conditional isRendered={!enabled}>
                {children}
            </Conditional>

            <Conditional isRendered={enabled}>
                <PlaygroundInner/>
            </Conditional>
        </>
    );
};