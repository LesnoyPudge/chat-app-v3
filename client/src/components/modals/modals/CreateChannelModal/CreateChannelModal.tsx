import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { ModalContainer } from '../../components';
import { CreateChannelTab, CreateOrFollowInvitationTab, FollowInvitationTab } from './components';



const tabs = {
    createOrFollowInvitation: <CreateOrFollowInvitationTab/>,
    followInvitation: <FollowInvitationTab/>,
    createChannel: <CreateChannelTab/>,
};

export type CreateChannelModalTabs = typeof tabs;

export const CreateChannelModal: FC = () => {
    return (
        <ModalWindow 
            label='Создать канал'
            withBackdrop
        >
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