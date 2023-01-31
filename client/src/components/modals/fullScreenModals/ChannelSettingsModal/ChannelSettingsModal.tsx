import { FC, useRef } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide, ScreenShake } from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';
import { Form, Formik } from 'formik';



export type ChannelSettingsModalTabs = typeof tabs;

export type ChannelSettingsModalFormValues = typeof initialValues;

const transitionOptions = getTransitionOptions.fullScreenModal({});

const tabs = {
    overviewTab: <OverviewTab/>,
    rolesTab: <RolesTab/>,
    membersTab: <MembersTab/>,
    bannedTab: <BannedTab/>,
};

const initialValues = {
    channelName: 'coolChannel',
    channelImage: null,
    channelIsPrivate: false,
    roleName: 'roleName',
    roleColor: '#fff',
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
                        <TabContextProvider tabs={tabs} onTabChange={onTabChange} initialTab='rolesTab'>
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