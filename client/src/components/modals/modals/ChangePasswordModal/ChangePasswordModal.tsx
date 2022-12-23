import { Button, ModalWindow } from '@components';
import { FormikTextInput } from '@libs';
import { Form, Formik } from 'formik';
import { FC } from 'react';
import { ModalContainer, ModalHeader, ModalTitle, ModalSubtitle, ModalContent, ModalFooter } from '../../components';



interface FormValues {
    oldPassword: string;
    newPassword: string;
    newPasswordAgain: string;
}

const initialValues: FormValues = { 
    oldPassword: '', 
    newPassword: '',
    newPasswordAgain: '',
};

export const ChangePasswordModal: FC = () => {
    return (
        <ModalWindow withBackdrop>
            {({ closeOverlay }) => {
                const handleSubmit = (values: FormValues) => {
                    console.log('form submited', values);
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
                                        <>Обновите пароль</>
                                    </ModalTitle>

                                    <ModalSubtitle>
                                        <>Введите текущий и новый пароли.</>
                                    </ModalSubtitle>
                                </ModalHeader>

                                <ModalContent className='gap-4'>
                                    <FormikTextInput
                                        name='oldPassword'
                                        label='Текущий пароль'
                                        required
                                    />

                                    <FormikTextInput
                                        name='newPassword'
                                        label='Новый пароль'
                                        required
                                    />

                                    <FormikTextInput
                                        name='newPasswordAgain'
                                        label='Подтверждение нового пароля'
                                        required
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