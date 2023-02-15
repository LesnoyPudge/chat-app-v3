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
    avatar: null,
    theme: 'dark',
    messageDisplayType: 'cozy',
};

export const AppSettingsModal: FC = () => {
    const isDirtyRef = useRef(false);

    return (
        <ModalWindow 
            label='Настройки приложения'
            transitionOptions={transitionOptions}
        >
            <ScreenShake>
                {({ resetShakeStacks, triggerScreenShake }) => {
                    const onTabChange = () => {
                        if (isDirtyRef.current) triggerScreenShake();
                        return !isDirtyRef.current;
                    };

                    return (
                        <TabContextProvider tabs={tabs} onTabChange={onTabChange}>
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