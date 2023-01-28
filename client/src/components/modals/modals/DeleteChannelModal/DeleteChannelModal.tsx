import { FC } from 'react';
import { Button, FieldLabel, ModalWindow, TextInput } from '@components';
import { ModalContainer, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../components';
import { Form, Formik } from 'formik';
import { FormikTextInput } from '@libs';



interface FormValues {
    channelName: string;
}

const initialValues: FormValues = {
    channelName: '',
};

export const DeleteChannelModal: FC = () => {
    const channelName = 'zdraste';

    return (
        <ModalWindow
            label='Удалить канал' 
            withBackdrop
        >
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
                                    <ModalTitle className='text-start text-heading-l truncated'>
                                        <>Удалить канал &apos;{channelName}&apos;</>
                                    </ModalTitle>
                                </ModalHeader>

                                <ModalContent className='gap-4'>
                                    <p>
                                        <>Вы уверены, что хотите удалить </>
                                        <strong>канал {channelName}</strong>
                                        <>? Это действие нельзя отменить.</>
                                    </p>

                                    <FormikTextInput
                                        name='channelName'
                                        label='Введите название канала'
                                        required
                                    >
                                        {(props) => (
                                            <div>
                                                <FieldLabel htmlFor={props.id}>
                                                    {props.label}
                                                </FieldLabel>

                                                <TextInput {...props}/>
                                            </div>
                                        )}
                                    </FormikTextInput>
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