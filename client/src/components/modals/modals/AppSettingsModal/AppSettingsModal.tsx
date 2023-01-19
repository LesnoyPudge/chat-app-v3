import { FC } from 'react';
import { AppearanceTab, Navigation, ProfileTab } from './components';
import { ModalWindow, TabContextProvider, TabPanel } from '@components';
import { getTransitionOptions } from '@utils';
import { Form, Formik } from 'formik';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide } from '../../components';



const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    profileTab: (
        <TabPanel 
            label='Настройки профиля' 
            controls='ProfileTab'
        >
            <ProfileTab/>
        </TabPanel>
    ),
    appearanceTab: (
        <TabPanel 
            label='Настройки внешнего вида' 
            controls='AppearanceTab'
        >
            <AppearanceTab/>
        </TabPanel>
    ),
};

export type AppSettingsModalTabs = typeof tabs;

export const AppSettingsModal: FC = () => {
    return (
        <ModalWindow 
            label='Настройки приложения'
            transitionOptions={transitionOptions}
        >
            <Formik
                initialValues={{ theme: 'dark', messageDisplayType: 'cozy' }}
                onSubmit={(values) => {console.log('submit', values);}}
            >
                <Form>
                    <TabContextProvider tabs={tabs}>
                        {({ currentTab }) => (
                            <FullScreenModalWrapper>
                                <FullScreenModalNavigationSide>
                                    <Navigation/>
                                </FullScreenModalNavigationSide>
    
                                <FullScreenModalContentSide>
                                    {currentTab.tab}
                                </FullScreenModalContentSide>
                            </FullScreenModalWrapper>   
                        )}
                    </TabContextProvider>
                </Form>
            </Formik>
        </ModalWindow>
    );
};