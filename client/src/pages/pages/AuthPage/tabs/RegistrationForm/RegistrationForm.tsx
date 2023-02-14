import { Button, PasswordTypeToggle, TabContext, TextInput, TextInputWrapper, PasswordTypeToggleButton, FieldLabel, RequiredWildcard } from '@components';
import { FormikTextInput, Heading } from '@libs';
import { AuthPageTabs } from '@pages/AuthPage/AuthPage';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



export const RegistrationForm: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<AuthPageTabs>;

    return (
        <Formik
            initialValues={{ email: '', login: '', password: '' }}
            onSubmit={(values) => {console.log(values);}}
        >
            {() => (
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
                            <div>
                                <FieldLabel htmlFor={props.id}>
                                    {props.label}
                                </FieldLabel>

                                <TextInput 
                                    className='mb-5'
                                    {...props}
                                />
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
                                placeholder='qwertyuiop'
                            >
                                {(props) => (
                                    <div className='mb-5'>
                                        <FieldLabel htmlFor={props.id}>
                                            {props.label}

                                            <RequiredWildcard/>
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
                        

                    <Button 
                        className='w-full font-bold h-11 mb-2'
                        type='submit' 
                        stylingPreset='brand'
                    >
                        <>Зарегистрироваться</>
                    </Button>

                    <Button 
                        className='self-start'
                        stylingPreset='link' 
                        onLeftClick={changeTab.loginForm}
                    >
                        <>Уже зарегистрированы?</>
                    </Button>
                </Form>
            )}
        </Formik>
    );
};