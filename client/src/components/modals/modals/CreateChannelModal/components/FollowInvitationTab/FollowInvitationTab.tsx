import { useMountedApiWrapper, useNavigator } from '@hooks';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, CreateChannelModalTabs, FieldLabel, OverlayContext, TabContext, TextInput } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikTextInput } from '@libs';
import { Endpoints } from '@shared';
import { ChannelApi } from '@redux/features';



type FollowInvitationFormValues = Endpoints.V1.Channel.AcceptInvitation.RequestBody;

const initialValues: FollowInvitationFormValues = {
    code: '',
};

export const FollowInvitationTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateChannelModalTabs>>(TabContext);
    const { closeOverlay } = useContext(OverlayContext);
    const [accept] = ChannelApi.useChannelAcceptInvitationMutation();
    const { apiWrapper } = useMountedApiWrapper();
    const { navigateTo } = useNavigator();

    const handleSubmit = async(values: FollowInvitationFormValues) => {
        apiWrapper(
            accept({ code: values.code }),
            (channel) => {
                closeOverlay();
                navigateTo.channel(channel.id);
            },
        );
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