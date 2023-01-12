import { Button, TabContext } from '@components';
import { FormikTextInput, Heading } from '@libs';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



export const LoginForm: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext;
    const toRegistrationForm = () => changeTab('RegistrationForm');

    return (
        <Formik
            initialValues={{ login: '', password: '' }}
            onSubmit={(values) => {console.log(values);}}
        >
            {() => (
                <Form>
                    <div className='flex flex-col items-center'>
                        <Heading className='text-heading-xl text-primary font-semibold mb-2 text-center'>
                            С возвращением
                        </Heading>

                        <div className='text-secondary mb-5 text-center'>
                            Мы так рады видеть вас снова!
                        </div>

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
                            className='w-full h-11 mb-2'
                            type='submit' 
                            stylingPreset='brand' 
                        >
                            Вход
                        </Button>

                        <div className='self-start flex items-center flex-wrap'>
                            <span className='text-sm text-muted mr-1'>
                                Нужна учётная запись?
                            </span>

                            <Button 
                                stylingPreset='link' 
                                onLeftClick={toRegistrationForm}
                            >
                                Зарегистрироваться
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};