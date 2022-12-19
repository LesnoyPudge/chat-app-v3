import { Form } from 'formik';
import { FC, useContext } from 'react';
import { Button, OverlayContext, TextInput } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';



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
                    <TextInput
                        label='Электронная почта'
                        name='email'
                        isRequired
                    />

                    <TextInput
                        label='Пароль'
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