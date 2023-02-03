import { FC, useRef } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide, ScreenShake } from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';
import { Form, Formik } from 'formik';



export type ChannelSettingsModalTabs = typeof tabs;

export interface ChannelSettingsModalFormValues {
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

const transitionOptions = getTransitionOptions.fullScreenModal({});

const tabs = {
    overviewTab: <OverviewTab/>,
    rolesTab: <RolesTab/>,
    membersTab: <MembersTab/>,
    bannedTab: <BannedTab/>,
};

const initialValues: ChannelSettingsModalFormValues = {
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

export const ChannelSettingsModal: FC = () => {
    const isDirtyRef = useRef(false);

    return (
        <ModalWindow 
            label='Настройки канала' 
            transitionOptions={transitionOptions}
        >
            <ScreenShake>
                {({ resetShakeStacks, triggerScreenShake }) => {
                    const onTabChange = () => {
                        if (isDirtyRef.current) triggerScreenShake();
                        return !isDirtyRef.current;
                    };

                    return (
                        <TabContextProvider
                            initialTab='rolesTab'
                            tabs={tabs} 
                            onTabChange={onTabChange}
                        >
                            {({ currentTab }) => (
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={(values) => {
                                        resetShakeStacks();
                                        console.log(values);
                                    }}
                                    onReset={resetShakeStacks}
                                    enableReinitialize
                                >
                                    {({ dirty }) => {
                                        isDirtyRef.current = dirty;
                                        if (!dirty) resetShakeStacks();

                                        return (
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
                                        );
                                    }}
                                </Formik>
                            )}
                        </TabContextProvider>
                    );
                }}
            </ScreenShake>
        </ModalWindow>
    );
};