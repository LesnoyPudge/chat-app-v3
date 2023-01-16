import { FC } from 'react';
import { Tab, ModalWindow, TabContextProvider } from '@components';
import { EnterCodeSlide, EnterNewEmailSlide, RequestCodeSlide } from './slides';
import { Formik } from 'formik';



interface FormValues {
    accessCode: string;
    email: string;
    password: string;
}

const initialValues: FormValues = {
    accessCode: '',
    email: '',
    password: '',
};

const tabs: Tab[] = [
    {
        identifier: 'RequestCodeSlide',
        tab: <RequestCodeSlide/>,
    },
    {
        identifier: 'EnterCodeSlide',
        tab: <EnterCodeSlide/>,
    },
    {
        identifier: 'EnterNewEmailSlide',
        tab: <EnterNewEmailSlide/>,
    },
];

export const ChangeEmailModal: FC = () => {
    return (
        <ModalWindow
            label='Изменить электронную почту' 
            withBackdrop
        >
            {({ closeOverlay }) => (
                <TabContextProvider tabs={tabs}>
                    {({ currentTab, changeTab }) => {

                        const handleSubmit = (values: FormValues) => {
                            if (currentTab.identifier === 'EnterCodeSlide') {
                                return changeTab('EnterNewEmailSlide');
                            }

                            console.log('final step submit', values);
                            closeOverlay();
                        };

                        return (
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                            >
                                {currentTab.tab}
                            </Formik>
                        );
                    }}
                </TabContextProvider>
                
            )}
        </ModalWindow>
    );
};