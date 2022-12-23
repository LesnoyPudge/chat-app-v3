import { Form } from 'formik';
import { FC } from 'react';
import { Button } from '@components';
import { ModalHeader, ModalTitle, ModalSubtitle, ModalContent, ModalFooter, ModalContainer } from '../../../../components';
import { FormikTextInput } from '@libs';



export const EnterCodeSlide: FC = () => {
    return (
        <Form>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        <>Введите код</>
                    </ModalTitle>

                    <ModalSubtitle>
                        <>Проверьте электронную почту: мы отправили вам код подтверждения.</> 
                        <> Введите его здесь, чтобы подтвердить свою личность.</>
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent>
                    <FormikTextInput
                        name='accessCode'
                        label='Код подтверждения'
                        required
                    />

                    <Button
                        className='text-start mt-2'
                        stylingPreset='link'
                        onLeftClick={() => console.log('new code request, go to first slide')}
                    >
                        <>Не получили код или у него истёк срок действия? Запросите новый.</>
                    </Button>
                </ModalContent>

                <ModalFooter>
                    <Button
                        stylingPreset='brand'
                        size='medium'
                        type='submit'
                    >
                        <>Далее</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </Form>
    );
};