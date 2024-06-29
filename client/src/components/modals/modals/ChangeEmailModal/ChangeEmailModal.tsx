import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { EnterCodeSlide, EnterNewEmailSlide, RequestCodeSlide } from './slides';
import { Form, Formik } from 'formik';



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

const tabs = {
    requestCodeSlide: <RequestCodeSlide/>,
    enterCodeSlide: <EnterCodeSlide/>,
    enterNewEmailSlide: <EnterNewEmailSlide/>,
};

export type ChangeEmailModalTabs = typeof tabs;

export const ChangeEmailModal: FC = () => {
    return (
        <ModalWindow
            label='Изменить электронную почту' 
            withBackdrop
        >
            {({ closeOverlay }) => (
                <TabContextProvider tabs={tabs}>
                    {({ currentTab }) => {
                        const handleSubmit = (values: FormValues) => {
                            console.log(`submit on step ${currentTab.identifier} with value ${values}`);
                            closeOverlay();
                        };
                        
                        return (
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                                // validationSchema={validationSchemas[currentTab]}
                            >
                                <Form>
                                    {currentTab.tab}
                                </Form>
                            </Formik>
                        );
                    }}
                </TabContextProvider>
                
            )}
        </ModalWindow>
    );
};