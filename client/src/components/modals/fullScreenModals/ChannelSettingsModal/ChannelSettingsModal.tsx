import { FC, useRef } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide, ScreenShake } from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';
import { Form, Formik } from 'formik';



export type ChannelSettingsModalTabs = typeof tabs;

const transitionOptions = getTransitionOptions.fullScreenModal({});

const tabs = {
    overviewTab: <OverviewTab/>,
    rolesTab: <RolesTab/>,
    membersTab: <MembersTab/>,
    bannedTab: <BannedTab/>,
};

const initialValues = {
    name: 'coolChannel',
    channelImage: null,
    isPrivate: false,
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