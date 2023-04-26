import { FC } from 'react';
import { ModalWindow, TabContextProvider } from '@components';
import { ModalContainer } from '../../components';
import { Form, Formik } from 'formik';
import { AddWhiteListTab, CreateRoomTab } from './components';
import { IRole, IUserPreview } from '@backendTypes';



export interface CreateRoomFormValues {
    roomType: 'text' | 'voice';
    name: string;
    isPrivate: boolean;
    allowedRoles: Set<string>;
    allowedMembers: Set<string>;
}

const initialValues: CreateRoomFormValues = {
    roomType: 'text',
    name: '',
    isPrivate: false,
    allowedRoles: new Set([]),
    allowedMembers: new Set([]),
};

const tabs = {
    createRoomTab: <CreateRoomTab/>,
    addWhiteListTab: <AddWhiteListTab/>,
};

export type CreateRoomModalTabs = typeof tabs;

export const CreateRoomModal: FC = () => {
    const handleSubmit = (values: CreateRoomFormValues) => {
        console.log('submit', values);
    };

    return (
        <ModalWindow 
            label='Создать комнату'
            withBackdrop
        >
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form>
                    <ModalContainer>
                        <TabContextProvider tabs={tabs}>
                            {({ currentTab }) => (
                                <>{currentTab.tab}</>
                            )}
                        </TabContextProvider>
                    </ModalContainer>
                </Form>
            </Formik>
        </ModalWindow>
    );
};