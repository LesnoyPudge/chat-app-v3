import { Button, ContentWithLoading, ErrorInLabel, FieldLabel, FormError, PasswordTypeToggle, PasswordTypeToggleButton, RequiredWildcard, TabContext, TextInput, TextInputWrapper } from '@components';
import { FormikTextInput, Heading } from '@libs';
import { AuthPageTabs } from '@pages/AuthPage/AuthPage';
import { UserApi } from '@redux/features';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { Endpoints } from '@shared';
import { yup } from '@reExport';



const initialValues: Endpoints.V1.User.Login.RequestBody = {
    login: '',
    password: '',
};

const validationSchema: yup.ObjectSchema<typeof initialValues> = yup.object({
    login: yup.string().trim().required('Логин не указан'),
    password: yup.string().trim().required('Пароль не указан'),
});

export const LoginForm: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<AuthPageTabs>;
    const [login, helpers] = UserApi.useUserLoginMutation();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={login}
        >
            {() => (
                <Form>
                    <Heading className='text-heading-xl text-color-primary font-semibold mb-2 text-center'>
                        <>С возвращением</>
                    </Heading>

                    <div className='text-color-secondary mb-5 text-center'>
                        <>Мы так рады видеть вас снова!</>
                    </div>

                    <FormikTextInput
                        label='Логин'
                        name='login'
                        placeholder='myLogin'
                        required
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
                                                type={type}
                                                onToggle={toggleType}
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
                        className='w-full h-11 mb-2'
                        type='submit'
                        stylingPreset='brand'
                        isLoading={helpers.isLoading}
                    >
                        <ContentWithLoading isLoading={helpers.isLoading}>
                            <>Вход</>
                        </ContentWithLoading>
                    </Button>

                    <div className='self-start flex items-center flex-wrap'>
                        <span className='text-sm text-color-muted mr-1'>
                            <>Нужна учётная запись?</>
                        </span>

                        <Button
                            stylingPreset='link'
                            onLeftClick={changeTab.registrationForm}
                        >
                            <>Зарегистрироваться</>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};