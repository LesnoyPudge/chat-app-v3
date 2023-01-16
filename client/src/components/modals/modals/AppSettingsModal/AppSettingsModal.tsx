import { FC } from 'react';
import { ContentSide, NavigationSide, AppearanceTab, ProfileTab } from './components';
import { Tab, ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { Form, Formik } from 'formik';



const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs: Tab[] = [
    {
        identifier: 'ProfileTab',
        tab: <ProfileTab/>,
    },
    {
        identifier: 'AppearanceTab',
        tab: <AppearanceTab/>,
    },
];

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
                            <div className='flex h-screen w-screen bg-primary-200'>
                                <NavigationSide/>
    
                                <ContentSide>
                                    {currentTab.tab}
                                </ContentSide>
                            </div>
                        )}
                    </TabContextProvider>
                </Form>
            </Formik>
        </ModalWindow>
    );
};