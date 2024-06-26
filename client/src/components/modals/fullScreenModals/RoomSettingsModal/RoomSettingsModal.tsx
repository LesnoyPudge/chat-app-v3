import { FC, useContext, useMemo } from 'react';
import { LoadedEntityContext, ModalWindow, TabContextProvider } from '@components';
import { 
    FullScreenModalContentSide, FullScreenModalContext, FullScreenModalContextProvider, 
    FullScreenModalNavigationSide, FullScreenModalWrapper 
} from '../components';
import { Form, Formik } from 'formik';
import { createValidationSchema, getTransitionOptions } from '@utils';
import { Navigation, OverviewTab } from './components';
import { SliceEntityState } from '@types';
import { RoomApi } from '@redux/features';
import { ContextConsumerProxy } from '@lesnoypudge/utils-react';



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
            <FullScreenModalContextProvider>
                <ContextConsumerProxy context={FullScreenModalContext}>
                    {({
                        resetShakeStacks, triggerScreenShake, 
                        closeMobileMenu, withResetShakeStacks,
                        setIsDirty, isDirtyRef
                    }) => (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={withResetShakeStacks(handleSubmit)}
                            onReset={resetShakeStacks}
                            enableReinitialize
                        >
                            {({ dirty }) => {
                                setIsDirty(dirty);
                                
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
                                )
                            }}
                        </Formik>
                    )}
                </ContextConsumerProxy>
            </FullScreenModalContextProvider>
        </ModalWindow>
    );
};