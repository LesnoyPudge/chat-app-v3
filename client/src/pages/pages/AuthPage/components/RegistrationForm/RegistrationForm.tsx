import { Button, PasswordTypeToggle, TabContext, TextInput, TextInputWrapper, PasswordTypeToggleButton, FieldLabel, RequiredWildcard, ContentWithLoading, FormError, ErrorInLabel } from '@components';
import { FormikTextInput, Heading } from '@libs';
import { AuthPageTabs } from '@pages/AuthPage/AuthPage';
import { yup } from '@reExport';
import { UserApi } from '@redux/features';
import { Endpoints } from '@shared';
import { VALIDATION_MESSAGES } from '@vars';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



const initialValues: Endpoints.V1.User.Registration.RequestBody = {
    login: '',
    password: '',
    username: '',
    email: '',
};

const validationSchema: yup.ObjectSchema<typeof initialValues> = yup.object({
    login: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED),
    password: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED),
    username: yup.string().trim().required(VALIDATION_MESSAGES.REQUIRED),
    email: yup.string().trim().optional().email(VALIDATION_MESSAGES.INVALID_EMAIL),
});

export const RegistrationForm: FC = () => {
    const { changeTab } = useContext<TabContext<AuthPageTabs>>(TabContext);
    const [registration, helpers] = UserApi.useUserRegistrationMutation();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={registration}
        >
            <Form>
                <Heading className='text-heading-xl text-color-primary font-bold mb-5 text-center'>
                    <>Создать учётную запись</>
                </Heading>

                <FormikTextInput
                    label='Адрес электронной почты'
                    name='email'
                    placeholder='my@email.com'
                >
                    {(props) => (
                        <div className='mb-5'>
                            <FieldLabel htmlFor={props.id}>
                                {props.label}

                                <ErrorInLabel error={props.error}/>
                            </FieldLabel>

                            <TextInput {...props}/>
                        </div>
                    )}
                </FormikTextInput>

                <FormikTextInput
                    label='Имя'
                    name='username'
                    required
                    placeholder='myNickname'
                >
                    {(props) => (
                        <div className='mb-5'>
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
                    label='Логин'
                    name='login'
                    required
                    placeholder='myLogin'
                >
                    {(props) => (
                        <div className='mb-5'>
                            <FieldLabel htmlFor={props.id}>
                                {props.label}

                                <RequiredWildcard/>

                                <ErrorInLabel error={props.error}/>
                            </FieldLabel>

                            <TextInput {...props}/>
                        </div>
                    )}
                </FormikTextInput>

                <PasswordTypeToggle>
                    {({ toggleType, type }) => (
                        <FormikTextInput
                            label='Пароль'
                            name='password'
                            type={type}
                            required
                            placeholder='myPassword'
                        >
                            {(props) => (
                                <div className='mb-5'>
                                    <FieldLabel htmlFor={props.id}>
                                        {props.label}

                                        <RequiredWildcard/>

                                        <ErrorInLabel error={props.error}/>
                                    </FieldLabel>

                                    <TextInputWrapper>
                                        <TextInput {...props}/>

                                        <PasswordTypeToggleButton
                                            onToggle={toggleType}
                                            type={type}
                                        />
                                    </TextInputWrapper>
                                </div>
                            )}
                        </FormikTextInput>
                    )}
                </PasswordTypeToggle>

                <FormError
                    className='mb-2'
                    error={helpers.error}
                />

                <Button
                    className='w-full font-bold h-11 mb-2'
                    type='submit'
                    stylingPreset='brand'
                    isLoading={helpers.isLoading}
                >
                    <ContentWithLoading isLoading={helpers.isLoading}>
                        <>Зарегистрироваться</>
                    </ContentWithLoading>
                </Button>

                <Button
                    className='self-start'
                    stylingPreset='link'
                    onLeftClick={changeTab.loginForm}
                >
                    <>Уже зарегистрированы?</>
                </Button>
            </Form>
        </Formik>
    );
};