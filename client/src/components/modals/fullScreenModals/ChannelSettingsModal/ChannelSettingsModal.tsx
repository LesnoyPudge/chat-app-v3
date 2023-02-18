import { FC, useRef } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide, ScreenShake } from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';
import { Form, Formik } from 'formik';



export type ChannelSettingsModalTabs = typeof tabs;

export interface ChannelSettingsModalFormValues {
    channelId: string;
    channelName: string,
    channelImage: string | null,
    channelIsPrivate: boolean,
    roleId: string,
    roleName: string,
    roleColorHEX: string,
    roleImage: string | null,
    roleChannelControl: boolean;
    roleRoomControl: boolean;
    roleCreateInvitation: boolean;
    roleKickMember: boolean;
    roleBanMember: boolean;
    roleSendMessage: boolean;
    roleIsAdministrator: boolean;
    roleMembers: string[];
}

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    overviewTab: <OverviewTab/>,
    rolesTab: <RolesTab/>,
    membersTab: <MembersTab/>,
    bannedTab: <BannedTab/>,
};

export const ChannelSettingsModal: FC = () => {
    const initialValues: ChannelSettingsModalFormValues = {
        channelId: 'someChannelID',
        channelName: 'coolChannel',
        channelImage: null,
        channelIsPrivate: false,
        roleId: 'id1',
        roleName: 'roleName',
        roleColorHEX: '#fff',
        roleImage: null,
        roleBanMember: true,
        roleChannelControl: true,
        roleCreateInvitation: false,
        roleIsAdministrator: false,
        roleKickMember: false,
        roleRoomControl: false,
        roleSendMessage: false,
        roleMembers: Array(29).fill('').map((_, index) => index.toString()),
    };

    return (
        <ModalWindow 
            label='Настройки канала' 
            transitionOptions={transitionOptions}
        >
            <ScreenShake>
                {({ triggerScreenShake, resetShakeStacks }) => (
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            resetShakeStacks();
                            console.log(values);
                        }}
                        onReset={resetShakeStacks}
                        enableReinitialize
                    >
                        {({ dirty }) => (
                            <TabContextProvider 
                                tabs={tabs} 
                                onTabChange={(prevent) => {
                                    if (!dirty) return;
                                    prevent();
                                    triggerScreenShake();
                                }}
                            >
                                {({ currentTab }) => (
                                    <Form>
                                        <FullScreenModalWrapper>
                                            <FullScreenModalNavigationSide>
                                                <Navigation/>
                                            </FullScreenModalNavigationSide>
    
                                            <FullScreenModalContentSide>
                                                {currentTab.tab}
                                            </FullScreenModalContentSide>
                                        </FullScreenModalWrapper>
                                    </Form>
                                )}
                            </TabContextProvider>
                        )}
                    </Formik>
                )}
            </ScreenShake>
        </ModalWindow>
    );
};