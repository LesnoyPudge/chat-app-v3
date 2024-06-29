import { FC } from 'react';
import { AppearanceTab, Navigation, ProfileTab } from './components';
import { ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { Form, Formik } from 'formik';
import { 
    FullScreenModalWrapper, FullScreenModalNavigationSide, 
    FullScreenModalContentSide, FullScreenModalContextProvider, 
    FullScreenModalContext
} from '../components';
import { ContextConsumerProxy, useContextProxy } from '@lesnoypudge/utils-react';



export type AppSettingsModalTabs = typeof tabs;

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    profileTab: <ProfileTab/>,
    appearanceTab: <AppearanceTab/>,
};

export const AppSettingsModal: FC = () => {
    const initialValues = {
        avatar: '',
        theme: 'dark',
        messageDisplayMode: 'cozy',
    };

    const handleSubmit = (values: any) => {
        console.log(values)
    }

    return (
        <ModalWindow
            label='Настройки приложения'
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
                        >
                            {({ dirty }) => {
                                setIsDirty(dirty)

                                return (
                                    <TabContextProvider
                                        tabs={tabs}
                                        onTabChange={(prevent) => {
                                            if (!isDirtyRef.current) {
                                                return closeMobileMenu()
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
                                );
                            }}
                        </Formik>
                    )}
                </ContextConsumerProxy>
            </FullScreenModalContextProvider>
        </ModalWindow>
    );
};