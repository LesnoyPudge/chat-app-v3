import { Button, FieldLabel, PasswordTypeToggle, PasswordTypeToggleButton, TabContext, TextInput, TextInputWrapper } from '@components';
import { FormikTextInput, Heading } from '@libs';
import { AuthPageTabs } from '@pages/AuthPage/AuthPage';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



export const LoginForm: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<AuthPageTabs>;

    return (
        <Formik
            initialValues={{ login: '', password: '' }}
            onSubmit={(values) => {console.log(values);}}
        >
            {() => (
                <Form>
                    <div className='flex flex-col items-center'>
                        <Heading className='text-heading-xl text-color-primary font-semibold mb-2 text-center'>
                            С возвращением
                        </Heading>

                        <div className='text-color-secondary mb-5 text-center'>
                            Мы так рады видеть вас снова!
                        </div>

                        <FormikTextInput
                            label='Логин'
                            name='login'
                            required
                            placeholder='myLogin'
                        >
                            {(props) => (
                                <div>
                                    <FieldLabel htmlFor={props.id}>
                                        <>Логин</>
                                    </FieldLabel>

                                    <TextInput 
                                        className='mb-5'
                                        {...props}
                                    />
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
                                    placeholder='qwerty'
                                >
                                    {(props) => (
                                        <div>
                                            <FieldLabel htmlFor={props.id}>
                                                <>Пароль</>
                                            </FieldLabel>

                                            <TextInputWrapper className='mb-5'>
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
                        
                        <Button 
                            className='w-full h-11 mb-2'
                            type='submit' 
                            stylingPreset='brand' 
                        >
                            <>Вход</>
                        </Button>

                        <div className='self-start flex items-center flex-wrap'>
                            <span className='text-sm text-color-muted mr-1'>
                                Нужна учётная запись?
                            </span>

                            <Button 
                                stylingPreset='link' 
                                onLeftClick={changeTab.registrationForm}
                            >
                                <>Зарегистрироваться</>
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};