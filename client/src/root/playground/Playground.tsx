import { Conditional, LightBoxModal, OverlayContextProvider } from '@components';
import { FC, PropsWithChildren } from 'react';



const PlaygroundInner: FC = () => {

    return (
        <>
            <OverlayContextProvider isOverlayExistInitial>
                <LightBoxModal src=''/>
            </OverlayContextProvider>
        </>
    );
};

const enabled = true;

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