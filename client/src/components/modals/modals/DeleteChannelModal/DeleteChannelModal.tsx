import { FC } from 'react';
import { Button, ModalWindow, TextInput } from '@components';
import { ModalContainer, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../components';
import { Form, Formik } from 'formik';



interface FormValues {
    channelName: string;
}

const initialValues: FormValues = {
    channelName: '',
};

export const DeleteChannelModal: FC = () => {
    const channelName = 'zdraste';

    return (
        <ModalWindow withBackdrop>
            {({ closeOverlay }) => {
                const handleSubmit = (values: FormValues) => {
                    console.log('delete channel', values);
                    closeOverlay();
                };

                return (
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <ModalContainer>
                                <ModalHeader>
                                    <ModalTitle className='self-start text-heading-l'>
                                        <>Удалить канал &apos;{channelName}&apos;</>
                                    </ModalTitle>
                                </ModalHeader>

                                <ModalContent className='gap-4'>
                                    <p>
                                        <>Вы уверены, что хотите удалить </>
                                        <strong>канал {channelName}</strong>
                                        <>? Это действие нельзя отменить.</>
                                    </p>

                                    <TextInput
                                        name='channelName'
                                        label='Введите название канала'
                                        isRequired
                                    />
                                </ModalContent>

                                <ModalFooter>
                                    <Button
                                        className='font-medium'
                                        stylingPreset='lite'
                                        size='medium'
                                        onLeftClick={closeOverlay}
                                    >
                                        <>Отмена</>
                                    </Button>

                                    <Button
                                        stylingPreset='brandDanger'
                                        size='medium'
                                        type='submit'
                                    >
                                        <>Удалить канал</>
                                    </Button>
                                </ModalFooter>
                            </ModalContainer>
                        </Form>
                    </Formik>
                );
            }}
        </ModalWindow>
    );
};