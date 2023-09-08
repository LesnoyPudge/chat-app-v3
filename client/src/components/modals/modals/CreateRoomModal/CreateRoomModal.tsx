import { FC, useContext } from 'react';
import { LoadedEntityContext, ModalWindow, MutationErrorContextProvider, OverlayContext, TabContextProvider } from '@components';
import { ModalContainer } from '../../components';
import { Form, Formik } from 'formik';
import { AddWhiteListTab, CreateRoomTab } from './components';
import { SliceEntityState } from '@types';
import { RoomApi } from '@redux/features';
import { createValidationSchema } from '@utils';
import { useMountedApiWrapper } from '@hooks';



export type CreateRoomFormValues = Pick<
    SliceEntityState.Room,
    'whiteList' | 'type' | 'name' | 'isPrivate'
>;

const initialValues: CreateRoomFormValues = {
    name: '',
    isPrivate: false,
    type: 'text',
    whiteList: {
        roles: [],
        users: [],
    },
};

const validationSchema = createValidationSchema<Pick<CreateRoomFormValues, 'name'>>(({
    yup,
    VALIDATION_MESSAGES,
}) => ({
    name: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED),
}));

const tabs = {
    createRoomTab: <CreateRoomTab/>,
    addWhiteListTab: <AddWhiteListTab/>,
};

export type CreateRoomModalTabs = typeof tabs;

export const CreateRoomModal: FC = () => {
    const [{ id }] = useContext(LoadedEntityContext.Channel);
    const [create, { error }] = RoomApi.useRoomCreateMutation();
    const { apiWrapper } = useMountedApiWrapper();
    const { closeOverlay } = useContext(OverlayContext);

    const handleSubmit = async(values: CreateRoomFormValues) => {
        await apiWrapper(create({
            channelId: id,
            ...values,
        }), closeOverlay);
    };

    return (
        <ModalWindow
            label='Создать комнату'
            withBackdrop
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <MutationErrorContextProvider error={error}>
                    <Form>
                        <ModalContainer>
                            <TabContextProvider tabs={tabs}>
                                {({ currentTab }) => (
                                    <>{currentTab.tab}</>
                                )}
                            </TabContextProvider>
                        </ModalContainer>
                    </Form>
                </MutationErrorContextProvider>
            </Formik>
        </ModalWindow>
    );
};