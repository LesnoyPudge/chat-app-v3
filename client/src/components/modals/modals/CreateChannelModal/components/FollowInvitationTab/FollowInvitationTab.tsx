import { useNavigator } from '@hooks';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, CreateChannelModalTabs, OverlayContext, TabContext } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikTextInput } from '@libs';



interface FollowInvitationFormValues {
    invitation: string;
}

const initialValues: FollowInvitationFormValues = {
    invitation: '',
};

export const FollowInvitationTab: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<CreateChannelModalTabs>;
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    // const { navigateTo } = useNavigator();

    const handleSubmit = (values: FollowInvitationFormValues) => {
        console.log('submit', values);
        closeOverlay();
        // navigateTo.channel('followed-channel');
    };

    return (
        <Formik 
            initialValues={initialValues} 
            onSubmit={handleSubmit}
        >
            <Form className='flex flex-col'>
                <ModalHeader>
                    <ModalTitle>
                        <>Присоединитесь к каналу</>
                    </ModalTitle>

                    <ModalSubtitle>
                        <>Введите приглашение, чтобы присоединиться к существующему каналу.</>
                    </ModalSubtitle>
                </ModalHeader>
        
                <ModalContent className='gap-2.5'>
                    <FormikTextInput
                        name='invitation'
                        label='Ссылка-приглашение'
                        placeholder='https://discord.gg/hTkzmak, hTkzmak'
                        required
                    />

                    {/* <ErrorBlock isError={true}>
                        <p>Errro: приглашение не действительно</p>
                    </ErrorBlock> */}
                </ModalContent>
        
                <ModalFooter>
                    <Button
                        stylingPreset='lite'
                        size='medium'
                        onLeftClick={changeTab.createOrFollowInvitation}
                    >
                        <>Назад</>
                    </Button>

                    <Button
                        stylingPreset='brand'
                        size='medium'
                        type='submit'
                    >
                        <>Присоединиться к серверу</>
                    </Button>
                </ModalFooter>
            </Form>
        </Formik>
    );
};