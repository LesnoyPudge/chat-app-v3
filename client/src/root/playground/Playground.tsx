import { ChannelSettingsModal, Conditional, OverlayContextProvider } from '@components';
import { FC, PropsWithChildren } from 'react';



const PlaygroundInner: FC = () => {
    return (
        <>
            <OverlayContextProvider isOverlayExistInitial={true}>
                <ChannelSettingsModal/>
            </OverlayContextProvider>
        </>
    );
};

const enabled = !!1;

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