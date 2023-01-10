import { Button, TabContext } from '@components';
import { FormikTextInput } from '@libs';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



export const RegistrationForm: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext;
    const toLoginForm = () => changeTab('LoginForm');

    return (
        <Formik
            initialValues={{ email: '', login: '', password: '' }}
            onSubmit={(values) => {console.log(values);}}
        >
            {() => (
                <Form>
                    <div className='flex flex-col items-center'>
                        <h3 className='text-heading-xl text-primary font-bold mb-5'>
                            Создать учётную запись
                        </h3>

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
                            onLeftClick={toLoginForm}
                        >
                            Уже зарегистрированы?
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};