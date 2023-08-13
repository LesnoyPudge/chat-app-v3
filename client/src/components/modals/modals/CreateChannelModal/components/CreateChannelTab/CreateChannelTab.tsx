import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, Conditional, TabContext, Image,SpriteImage, CreateChannelModalTabs, FieldLabel, TextInput } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { FormikFileInput, FormikFileUploadContextProvider, FormikTextInput } from '@libs';
import { MBToBytes } from '@utils';
import { ChannelApi } from '@redux/features';
import { Endpoints, Prettify, StrictOmit } from '@shared';



type CreateChannelFormValues = Prettify<StrictOmit<
    Endpoints.V1.Channel.Create.RequestBody,
    'avatar'
> & {
    avatar: Endpoints.V1.Channel.Create.RequestBody['avatar'][];
}>;

const initialValues: CreateChannelFormValues = {
    identifier: '',
    name: '',
    avatar: [],
};

export const CreateChannelTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateChannelModalTabs>>(TabContext);
    const [create] = ChannelApi.useChannelCreateMutation();

    const handleSubmit = (values: CreateChannelFormValues) => {
        create({
            ...values,
            avatar: values.avatar[0],
        });
    };

    return (
        <Formik
            initialValues={initialValues}
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
                        <FormikFileInput className='self-center mb-6'>
                            {({ value }) => {
                                return (
                                    <div className='peer-focus-visible:focused flex w-20 h-20 bg-primary-300 rounded-full pointer-events-none'>
                                        <Conditional isRendered={!!value.length}>
                                            <Image
                                                className='rounded-full'
                                                file={value[0]}
                                                alt='Значок канала'
                                            />
                                        </Conditional>

                                        <Conditional isRendered={!value}>
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
                                );
                            }}
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
                            <>Создать</>
                        </Button>
                    </ModalFooter>
                </Form>
            </FormikFileUploadContextProvider>
        </Formik>
    );
};