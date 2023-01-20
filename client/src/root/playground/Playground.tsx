import { Conditional } from '@components';
import { FC, PropsWithChildren } from 'react';



const PlaygroundInner: FC = () => {
    return (
        <>
            
        </>
    );
};

const enabled = false;

export const Playground: FC<PropsWithChildren> = ({ children }) => {
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