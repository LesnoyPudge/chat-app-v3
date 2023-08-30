import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, TabContext, Image,SpriteImage, CreateChannelModalTabs, FieldLabel, TextInput, RequiredWildcard, ErrorInLabel, FileInput, FormError, OverlayContext } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikFileInput, FormikTextInput } from '@libs';
import { MBToBytes, createValidationSchema } from '@utils';
import { ChannelApi } from '@redux/features';
import { Endpoints } from '@shared';
import { MIME } from '@vars';
import { useMountedApiWrapper, useNavigator } from '@hooks';



type CreateChannelFormValues = Endpoints.V1.Channel.Create.RequestBody;

const initialValues: CreateChannelFormValues = {
    identifier: '',
    name: '',
    avatar: undefined,
};

const validationSchema = createValidationSchema<CreateChannelFormValues>(({
    yup,
    VALIDATION_MESSAGES,
}) => ({
    name: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
    avatar: createValidationSchema<CreateChannelFormValues['avatar']>(() => ({
        base64: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
        name: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
        type: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
        size: yup.number().required(VALIDATION_MESSAGES.REQUIRED),
    })).optional().default(undefined),
    identifier: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
}));

export const CreateChannelTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateChannelModalTabs>>(TabContext);
    const [create, helpers] = ChannelApi.useChannelCreateMutation();
    const { apiWrapper } = useMountedApiWrapper();
    const { navigateTo } = useNavigator();
    const { closeOverlay } = useContext(OverlayContext);

    const handleSubmit = (value: CreateChannelFormValues) => {
        apiWrapper(create(value), (channel) => {
            closeOverlay();
            navigateTo.channel(channel.id);
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form>
                <ModalHeader>
                    <ModalTitle>
                        <>Персонализируйте свой канал</>
                    </ModalTitle>

                    <ModalSubtitle>
                        <>Персонализируйте свой новый канал, выбрав ему название и значок. </>
                        <>Их можно будет изменить в любой момент.</>
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent>
                    <FormikFileInput
                        name='avatar'
                        label='Загрузить значок канала'
                        options={{
                            accept: MIME.IMAGES,
                            amountLimit: 1,
                            sizeLimit: MBToBytes(1),
                        }}
                    >
                        {({ value, fileInputProps }) => (
                            <FileInput
                                className='self-center rounded-full'
                                {...fileInputProps}
                            >
                                <div className='flex w-20 h-20 bg-primary-300 rounded-full pointer-events-none'>
                                    <If condition={!!value}>
                                        <Image
                                            className='rounded-full'
                                            file={value}
                                            alt='Значок канала'
                                        />
                                    </If>

                                    <If condition={!value}>
                                        <div className='flex relative w-full h-full rounded-full border-2 border-icon-100 border-dashed'>
                                            <span className='m-auto text-2xs uppercase font-semibold'>
                                                <>Загрузить</>
                                            </span>

                                            <div className='absolute top-0 right-0 w-6 h-6 p-1.5 bg-brand rounded-full'>
                                                <SpriteImage
                                                    className='w-full h-full fill-white'
                                                    name='PLUS_ICON'
                                                />
                                            </div>
                                        </div>
                                    </If>
                                </div>
                            </FileInput>
                        )}
                    </FormikFileInput>

                    <FormikTextInput
                        name='identifier'
                        label='Идентификатор канала'
                        placeholder='my-unique-channel'
                        maxLength={32}
                        required
                    >
                        {(props) => (
                            <div className='mt-6'>
                                <FieldLabel htmlFor={props.id}>
                                    {props.label}

                                    <RequiredWildcard/>

                                    <ErrorInLabel error={props.error}/>
                                </FieldLabel>

                                <TextInput {...props}/>
                            </div>
                        )}
                    </FormikTextInput>

                    <FormikTextInput
                        name='name'
                        label='Название канала'
                        placeholder='Мой новый канал'
                        maxLength={32}
                        required
                    >
                        {(props) => (
                            <div className='mt-4'>
                                <FieldLabel htmlFor={props.id}>
                                    {props.label}

                                    <RequiredWildcard/>

                                    <ErrorInLabel error={props.error}/>
                                </FieldLabel>

                                <TextInput {...props}/>
                            </div>
                        )}
                    </FormikTextInput>

                    <FormError
                        className='mt-4'
                        error={helpers.error}
                    />
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
                        <>Создать</>
                    </Button>
                </ModalFooter>
            </Form>
        </Formik>
    );
};