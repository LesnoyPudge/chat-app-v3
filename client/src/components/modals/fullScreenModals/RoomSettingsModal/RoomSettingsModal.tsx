import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { FullScreenModalContentSide, FullScreenModalNavigationSide, FullScreenModalWrapper, ScreenShake } from '../components';
import { Form, Formik } from 'formik';
import { getTransitionOptions } from '@utils';
import { Navigation, OverviewTab, PermissionsTab } from './components';



export type RoomSettingsModalTabs = typeof tabs;

interface RoomSettingsModalFormValues {
    some?: string;
}

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    overviewTab: <OverviewTab/>,
    permissionsTab: <PermissionsTab/>,
};

export const RoomSettingsModal: FC = () => {
    const initialValues: RoomSettingsModalFormValues = {

    };

    return (
        <ModalWindow 
            label='Настройки комнаты'
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