import { FC, useContext, useMemo } from 'react';
import { LoadedEntityContext, ModalWindow, TabContextProvider } from '@components';
import { FullScreenModalContentSide, FullScreenModalNavigationSide, FullScreenModalWrapper, ScreenShake } from '../components';
import { Form, Formik } from 'formik';
import { createValidationSchema, getTransitionOptions } from '@utils';
import { Navigation, OverviewTab } from './components';
import { SliceEntityState } from '@types';
import { RoomApi } from '@redux/features';



export type RoomSettingsModalTabs = typeof tabs;


export type RoomSettingsModalFormValues = Pick<
    SliceEntityState.Room,
    'name' | 'isPrivate' | 'whiteList'
>;

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    overviewTab: <OverviewTab/>,
};

const validationSchema = createValidationSchema<Pick<RoomSettingsModalFormValues, 'name'>>(({
    yup,
    VALIDATION_MESSAGES,
}) => ({
    name: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED),
}));

export const RoomSettingsModal: FC = () => {
    const [room] = useContext(LoadedEntityContext.Room);
    const [update] = RoomApi.useRoomUpdateMutation();
    const initialValues: RoomSettingsModalFormValues = useMemo(() => ({
        name: room.name,
        isPrivate: room.isPrivate,
        whiteList: room.whiteList,
    }), [room.name, room.isPrivate, room.whiteList]);

    const handleSubmit = async(values: RoomSettingsModalFormValues) => {
        await update({
            channelId: room.channel,
            roomId: room.id,
            ...values,
        });
    };

    return (
        <ModalWindow
            label='Настройки комнаты'
            transitionOptions={transitionOptions}
        >
            <ScreenShake>
                {({ triggerScreenShake, resetShakeStacks, withResetShakeStacks }) => (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={withResetShakeStacks(handleSubmit)}
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