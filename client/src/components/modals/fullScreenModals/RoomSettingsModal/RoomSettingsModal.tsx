import { FC } from 'react';
import { ModalWindow } from '@components';
import { FullScreenModalContentSide, FullScreenModalNavigationSide, FullScreenModalWrapper, ScreenShake } from '../components';
import { Form, Formik } from 'formik';



export const RoomSettingsModal: FC = () => {
    return (
        <ModalWindow label='Настройки комнаты'>
            <ScreenShake>
                {({ triggerScreenShake }) => (
                    <Formik initialValues={{}} onSubmit={() => {}}>
                        <Form>
                            <FullScreenModalWrapper>
                                <FullScreenModalNavigationSide>
                                    <>navigation</>
                                </FullScreenModalNavigationSide>

                                <FullScreenModalContentSide>
                                    <>content</>
                                </FullScreenModalContentSide>
                            </FullScreenModalWrapper>
                        </Form>
                    </Formik>
                )}
            </ScreenShake>
        </ModalWindow>
    );
};