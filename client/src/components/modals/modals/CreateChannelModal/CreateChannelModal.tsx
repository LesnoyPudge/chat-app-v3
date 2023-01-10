import { FC } from 'react';
import { ModalWindow, Tab, TabContextProvider } from '@components';
import { ModalContainer } from '../../components';
import { CreateChannelTab, CreateOrFollowInvitationTab, FollowInvitationTab } from './components';



const tabs: Tab[] = [
    {
        tab: <CreateOrFollowInvitationTab/>,
        identifier: 'CreateOrFollowInvitation',
    },
    {
        tab: <FollowInvitationTab/>,
        identifier: 'FollowInvitation',
    },
    {
        tab: <CreateChannelTab/>,
        identifier: 'CreateChannel',
    },
];

export const CreateChannelModal: FC = () => {
    return (
        <ModalWindow withBackdrop>
            <ModalContainer>
                <TabContextProvider tabs={tabs}>
                    {({ currentTab }) => (
                        <>{currentTab.tab}</>
                    )}
                </TabContextProvider>
            </ModalContainer>
        </ModalWindow>
    );
};