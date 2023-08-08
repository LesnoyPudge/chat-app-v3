import { Button, FieldLabel, ModalWindow, OverlayContext, PasswordTypeToggle, PasswordTypeToggleButton, TextInput, TextInputWrapper } from '@components';
import { FormikTextInput } from '@libs';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';



interface FormValues {
    password: string;
}

const initialValues: FormValues = {
    password: '',
};

const DeleteAccountModalInner: FC = () => {
    const { closeOverlay } = useContext(OverlayContext);

    const handleSubmit = (values: FormValues) => {
        console.log('delete accound', values);
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
                        <ModalTitle className='text-heading-l self-start'>
                            <>Удалить учётную запись</>
                        </ModalTitle>
                    </ModalHeader>
    
                    <ModalContent className='gap-4'>
                        <p>
                            <>Вы уверены, что хотите удалить свою учётную запись? </>
                            <>Вы немедленно выйдете из неё и больше не сможете войти. </>
                            <>Все каналы, которыми вы владеете, также будут удалены.</>
                        </p>

                        <PasswordTypeToggle>
                            {({ toggleType, type }) => (
                                <FormikTextInput
                                    name='password'
                                    label='Введите пароль'
                                    type={type}
                                    required
                                >
                                    {(props) => (
                                        <div>
                                            <FieldLabel htmlFor={props.id}>
                                                {props.label}
                                            </FieldLabel>

                                            <TextInputWrapper>
                                                <TextInput {...props}/>

                                                <PasswordTypeToggleButton
                                                    type={type}
                                                    onToggle={toggleType}
                                                />
                                            </TextInputWrapper>
                                        </div>
                                    )}
                                </FormikTextInput>
                            )}
                        </PasswordTypeToggle>
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
                            stylingPreset='brandDanger'
                            size='medium'
                            type='submit'
                        >
                            <>Удалить учётную запись</>
                        </Button>
                    </ModalFooter>
                </ModalContainer>
            </Form>
        </Formik>
    );
};

export const DeleteAccountModal: FC = () => {
    return (
        <ModalWindow 
            label='Удалить учётную запись'
            withBackdrop
        >
            <DeleteAccountModalInner/>
        </ModalWindow>
    );
};