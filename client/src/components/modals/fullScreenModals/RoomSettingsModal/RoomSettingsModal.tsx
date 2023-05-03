import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { FullScreenModalContentSide, FullScreenModalNavigationSide, FullScreenModalWrapper, ScreenShake } from '../components';
import { Form, Formik } from 'formik';
import { getTransitionOptions } from '@utils';
import { Navigation, OverviewTab } from './components';



interface RoomSettingsModal {
    roomId: string;
}

export type RoomSettingsModalTabs = typeof tabs;

export interface RoomSettingsModalFormValues {
    roomName: string;
    isPrivate: boolean;
    allowedRoles: Set<string>;
    allowedMembers: Set<string>;
}

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    overviewTab: <OverviewTab/>,
};

export const RoomSettingsModal: FC<RoomSettingsModal> = ({
    roomId,
}) => {
    const initialValues: RoomSettingsModalFormValues = {
        roomName: 'some room name',
        isPrivate: false,
        allowedRoles: new Set(['1', '2', '3', '4', '5']),
        allowedMembers: new Set(['1', '2', '3', '4', '5']),
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
                            console.log(roomId, values);
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