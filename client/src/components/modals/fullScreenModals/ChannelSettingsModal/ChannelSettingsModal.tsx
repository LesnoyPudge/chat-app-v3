import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide } from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';



export type ChannelSettingsModalTabs = typeof tabs;

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    overviewTab: <OverviewTab/>,
    rolesTab: <RolesTab/>,
    membersTab: <MembersTab/>,
    bannedTab: <BannedTab/>,
};

export const ChannelSettingsModal: FC = () => {
    return (
        <ModalWindow 
            label='Настройки канала' 
            transitionOptions={transitionOptions}
        >
            <TabContextProvider tabs={tabs}>
                {({ currentTab }) => (
                    <FullScreenModalWrapper>
                        <FullScreenModalNavigationSide>
                            <Navigation/>
                        </FullScreenModalNavigationSide>
    
                        <FullScreenModalContentSide>
                            {currentTab.tab}
                        </FullScreenModalContentSide>
                    </FullScreenModalWrapper>
                )}
            </TabContextProvider>
        </ModalWindow>
    );
};