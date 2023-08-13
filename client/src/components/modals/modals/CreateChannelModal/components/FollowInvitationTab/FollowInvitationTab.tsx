import { useMountedApiWrapper, useNavigator } from '@hooks';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, CreateChannelModalTabs, ErrorInLabel, FieldLabel, FormError, OverlayContext, RequiredWildcard, TabContext, TextInput } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikTextInput } from '@libs';
import { Endpoints } from '@shared';
import { ChannelApi } from '@redux/features';
import { createValidationSchema } from '@utils';



type FollowInvitationFormValues = Endpoints.V1.Channel.AcceptInvitation.RequestBody;

const initialValues: FollowInvitationFormValues = {
    code: '',
};

const validationSchema = createValidationSchema<FollowInvitationFormValues>(({
    yup,
    VALIDATION_MESSAGES,
}) => ({
    code: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
}));

export const FollowInvitationTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateChannelModalTabs>>(TabContext);
    const { closeOverlay } = useContext(OverlayContext);
    const [accept, helpers] = ChannelApi.useChannelAcceptInvitationMutation();
    const { apiWrapper } = useMountedApiWrapper();
    const { navigateTo } = useNavigator();

    const handleSubmit = async(values: FollowInvitationFormValues) => {
        if (helpers.isLoading) return;

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
            validationSchema={validationSchema}
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
                        name='code'
                        label='Ссылка-приглашение'
                        placeholder='https://discord.gg/hTkzmak, hTkzmak'
                        required
                    >
                        {(props) => (
                            <div>
                                <FieldLabel htmlFor={props.id}>
                                    {props.label}

                                    <RequiredWildcard/>

                                    <ErrorInLabel error={props.error}/>
                                </FieldLabel>

                                <TextInput {...props}/>
                            </div>
                        )}
                    </FormikTextInput>

                    <FormError error={helpers.error}/>
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
                        isLoading={helpers.isLoading}
                    >
                        <>Присоединиться к серверу</>
                    </Button>
                </ModalFooter>
            </Form>
        </Formik>
    );
};