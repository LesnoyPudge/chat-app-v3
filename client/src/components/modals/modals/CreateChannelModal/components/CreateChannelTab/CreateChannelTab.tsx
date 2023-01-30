import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Button, Conditional, TabContext, Image, Icon, CreateChannelModalTabs, FieldLabel, TextInput } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../../../components';
import { EncodedFile } from '@types';
import { FormikFileInput, FormikTextInput } from '@libs';



interface CreateChannelFormValues {
    avatar: EncodedFile | null;
    name: string;
}

const initialValues: CreateChannelFormValues = {
    avatar: null,
    name: '',
};

export const CreateChannelTab: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<CreateChannelModalTabs>;

    const handleSubmit = (values: CreateChannelFormValues) => {
        console.log('submit', values);
    };

    return (
        <Formik
            initialValues={initialValues}
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
                        className='self-center mb-6'
                        label='Загрузить значок канала'
                        name='avatar'
                        accept='.jpg,.jpeg,.png'
                    >
                        {({ value }) => {
                            return (
                                <div className='peer-focus-visible:focused flex w-20 h-20 bg-primary-300 rounded-full'>
                                    <Conditional isRendered={!!value}>
                                        <Image
                                            className='rounded-full'
                                            file={value}
                                            alt='Значок канала'
                                        />
                                    </Conditional>

                                    <Conditional isRendered={!value}>
                                        <div className='flex relative w-full h-full rounded-full border-2 border-icon-100 border-dashed'>
                                            <span className='m-auto text-2xs uppercase font-semibold'>
                                                <>Загрузить</>
                                            </span>

                                            <div className='absolute top-0 right-0 w-6 h-6 p-1.5 bg-brand rounded-full'>
                                                <Icon
                                                    className='w-full h-full fill-white'
                                                    iconId='plus-icon'
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
        </Formik>
    );
};