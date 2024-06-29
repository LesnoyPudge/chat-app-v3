import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { 
    FullScreenModalWrapper, FullScreenModalNavigationSide, 
    FullScreenModalContentSide, FullScreenModalContextProvider, 
    FullScreenModalContext
} from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';
import { Form, Formik } from 'formik';
import { EncodedFile } from '@types';
import { ContextConsumerProxy } from '@lesnoypudge/utils-react';



export type ChannelSettingsModalTabs = typeof tabs;

export interface ChannelSettingsModalFormValues {
    channelId: string;
    channelName: string,
    channelImage: EncodedFile[],
    channelIsPrivate: boolean,
    roleId: string,
    roleName: string,
    roleColorHEX: string,
    roleImage: EncodedFile[],
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
        channelImage: [],
        channelIsPrivate: false,
        roleId: 'id1',
        roleName: 'roleName',
        roleColorHEX: '#fff',
        roleImage: [],
        roleBanMember: true,
        roleChannelControl: true,
        roleCreateInvitation: false,
        roleIsAdministrator: false,
        roleKickMember: false,
        roleRoomControl: false,
        roleSendMessage: false,
        roleMembers: Array(29).fill('').map((_, index) => index.toString()),
    };

    const handleSubmit = (values: ChannelSettingsModalFormValues) => {
        console.log(values)
    }

    return (
        <ModalWindow 
            label='Настройки канала' 
            transitionOptions={transitionOptions}
        >
            <FullScreenModalContextProvider>
                <ContextConsumerProxy context={FullScreenModalContext}>
                    {({
                        resetShakeStacks, triggerScreenShake, 
                        closeMobileMenu, withResetShakeStacks,
                        setIsDirty, isDirtyRef
                    }) => (
                        <Formik
                            initialValues={initialValues}
                            onSubmit={withResetShakeStacks(handleSubmit)}
                            onReset={resetShakeStacks}
                            enableReinitialize
                        >
                            {({ dirty }) => {
                                setIsDirty(dirty);
                                
                                return (
                                    <TabContextProvider 
                                        tabs={tabs} 
                                        onTabChange={(prevent) => {
                                            if (!isDirtyRef.current) {
                                                closeMobileMenu()
                                                return;
                                            }
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
                                )
                            }}
                        </Formik>
                    )}
                </ContextConsumerProxy>
            </FullScreenModalContextProvider>
        </ModalWindow>
    );
};