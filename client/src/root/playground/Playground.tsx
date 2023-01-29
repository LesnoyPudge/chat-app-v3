import { AppSettingsModal, ChannelSettingsModal, Conditional, OverlayContextProvider } from '@components';
import { FC, PropsWithChildren } from 'react';
import { ColorPicker } from 'src/components/modals/fullScreenModals/AppSettingsModal/components/ProfileTab/components/ProfileManager/components/Banner/components';



const PlaygroundInner: FC = () => {
    return (
        <>
            <OverlayContextProvider isOverlayExistInitial={true}>
                {/* <AppSettingsModal/> */}

                {/* <ChannelSettingsModal/> */}
            </OverlayContextProvider>
        </>
    );
};

const enabled = !!0;

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