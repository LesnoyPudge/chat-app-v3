import { Button, TabContext } from '@components';
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
                    <div className='flex flex-col items-center'>
                        <Heading className='text-heading-xl text-primary font-bold mb-5 text-center'>
                            <>Создать учётную запись</>
                        </Heading>

                        <FormikTextInput
                            className='mb-5'
                            label='Адрес электронной почты'
                            name='email'
                            placeholder='my@email.com'
                            
                        />

                        <FormikTextInput
                            className='mb-5'
                            label='Логин'
                            name='login'
                            required
                            placeholder='myLogin'
                        />

                        <FormikTextInput
                            className='mb-5'
                            label='Пароль'
                            name='password'
                            type='password'
                            required
                            placeholder='myPassword'
                        />

                        <Button 
                            className='w-full font-bold h-11 mb-2'
                            type='submit' 
                            stylingPreset='brand' 
                            onLeftClick={() => console.log('register')}
                        >
                            Зарегистрироваться
                        </Button>

                        <Button 
                            className='self-start'
                            stylingPreset='link' 
                            onLeftClick={changeTab.loginForm}
                        >
                            Уже зарегистрированы?
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};