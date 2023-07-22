import { FC, useRef } from 'react';
import { AppearanceTab, Navigation, ProfileTab } from './components';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { Form, Formik } from 'formik';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide, ScreenShake } from '../components';



export type AppSettingsModalTabs = typeof tabs;

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    profileTab: <ProfileTab/>,
    appearanceTab: <AppearanceTab/>,
};

const initialValues = {
    avatar: [],
    theme: 'dark',
    messageDisplayType: 'cozy',
};

export const AppSettingsModal: FC = () => {
    return (
        <ModalWindow
            label='Настройки приложения'
            transitionOptions={transitionOptions}
        >
            <ScreenShake>
                {({ resetShakeStacks, triggerScreenShake }) => (
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            resetShakeStacks();
                            console.log(values);
                        }}
                        onReset={resetShakeStacks}
                    >
                        {({ dirty }) => {
                            return (
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
                            );
                        }}
                    </Formik>
                )}
            </ScreenShake>
        </ModalWindow>
    );
};