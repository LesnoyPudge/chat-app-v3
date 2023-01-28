import { Form } from 'formik';
import { FC, useContext } from 'react';
import { Button, FieldLabel, OverlayContext, PasswordTypeToggle, PasswordTypeToggleButton, TextInput, TextInputWrapper } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikTextInput } from '@libs';



export const EnterNewEmailSlide: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <Form>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        <>Введите адрес электронной почты</>
                    </ModalTitle>

                    <ModalSubtitle>
                        <>Введите новый адрес электронной почты и текущий пароль.</>
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent className='gap-4'>
                    <FormikTextInput
                        label='Электронная почта'
                        name='email'
                        type='email'
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

                    <PasswordTypeToggle>
                        {({ type, toggleType }) => (
                            <FormikTextInput
                                label='Пароль'
                                name='password'
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
                        stylingPreset='brand'
                        size='medium'
                        type='submit'
                    >
                        <>Готово</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </Form>
    );
};