import { Button, ModalWindow, TextInput } from '@components';
import { Form, Formik } from 'formik';
import { FC } from 'react';
import { ModalContainer, ModalHeader, ModalTitle, ModalSubtitle, ModalContent, ModalFooter } from '../../components';



interface FormValues {
    username: string;
    password: string;
}

const initialValues: FormValues = {
    username: '',
    password: '',
};

export const ChangeUsernameModal: FC = () => {
    return (
        <ModalWindow withBackdrop>
            {({ closeOverlay }) => {
                const handleSubmit = (values: FormValues) => {
                    console.log('change username submit', values);
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
                                    <ModalTitle>
                                        <>Измените имя пользователя</>
                                    </ModalTitle>

                                    <ModalSubtitle>
                                        <>Введите новое имя пользователя и текущий пароль.</>
                                    </ModalSubtitle>
                                </ModalHeader>

                                <ModalContent className='gap-4'>
                                    <TextInput
                                        label='Имя пользователя'
                                        name='username'
                                        isRequired
                                    />

                                    <TextInput
                                        label='Текущий пароль'
                                        name='password'
                                        isRequired
                                    />
                                </ModalContent>

                                <ModalFooter>
                                    <Button
                                        stylingPreset='lite'
                                        size='medium'
                                        onLeftClick={closeOverlay}
                                    >
                                        <>Отмена</>
                                    </Button>

                                    <Button
                                        type='submit'
                                        stylingPreset='brand'
                                        size='medium'
                                    >
                                        <>Готово</>
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