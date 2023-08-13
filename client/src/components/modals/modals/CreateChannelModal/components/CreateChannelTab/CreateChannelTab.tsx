import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, Conditional, TabContext, Image,SpriteImage, CreateChannelModalTabs, FieldLabel, TextInput, RequiredWildcard, ErrorInLabel } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikFileInput, FormikFileUploadContextProvider, FormikTextInput } from '@libs';
import { MBToBytes, createValidationSchema } from '@utils';
import { ChannelApi } from '@redux/features';
import { Endpoints, Override, Prettify, StrictOmit, ValueOf } from '@shared';



type CreateChannelFormValues = Prettify<StrictOmit<
    Endpoints.V1.Channel.Create.RequestBody,
    'avatar'
> & Override<
    Endpoints.V1.Channel.Create.RequestBody,
    'avatar',
    Pick<Endpoints.V1.Channel.Create.RequestBody, 'avatar'>['avatar'][]
>>

const initialValues: CreateChannelFormValues = {
    identifier: '',
    name: '',
    avatar: [],
};

const validationSchema = createValidationSchema<CreateChannelFormValues>(({
    yup,
    VALIDATION_MESSAGES,
}) => ({
    name: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
    avatar: yup.array().optional().of(
        createValidationSchema<ValueOf<CreateChannelFormValues['avatar']>>(({ yup }) => ({
            base64: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
            name: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
            type: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
            size: yup.number().required(VALIDATION_MESSAGES.REQUIRED),
        })),
    ),
    identifier: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
}));

export const CreateChannelTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateChannelModalTabs>>(TabContext);
    const [create, helpers] = ChannelApi.useChannelCreateMutation();

    const handleSubmit = (values: CreateChannelFormValues) => {
        if (helpers.isLoading) return;

        create({
            ...values,
            identifier: String(Math.floor(Math.random() * 100000)),
            avatar: values.avatar[0],
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <FormikFileUploadContextProvider
                name='avatar'
                label='Загрузить значок канала'
                options={{
                    accept: '.jpg,.jpeg,.png',
                    amountLimit: 1,
                    sizeLimit: MBToBytes(1),
                }}
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
                        <FormikFileInput className='self-center mb-6 rounded-full'>
                            {({ value }) => (
                                <div className='flex w-20 h-20 bg-primary-300 pointer-events-none'>
                                    <Conditional isRendered={!!value.length}>
                                        <Image
                                            className='rounded-full'
                                            file={value[0]}
                                            alt='Значок канала'
                                        />
                                    </Conditional>

                                    <Conditional isRendered={!value.length}>
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
                                    </Conditional>
                                </div>
                            )}
                        </FormikFileInput>

                        <FormikTextInput
                            name='name'
                            label='Название канала'
                            maxLength={32}
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
            </FormikFileUploadContextProvider>
        </Formik>
    );
};