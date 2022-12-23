import { Button, TabContext, TabContex } from '@components';
import { FormikTextInput } from '@libs';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



export const LoginForm: FC = () => {
    const { changeTab } = useContext(TabContex) as TabContext;
    const toRegistrationForm = () => changeTab('RegistrationForm');

    return (
        <Formik
            initialValues={{ login: '', password: '' }}
            onSubmit={(values) => {console.log(values);}}
        >
            {() => (
                <Form>
                    <div className='flex flex-col items-center'>
                        <h3 className='text-heading-xl text-primary font-semibold mb-2'>
                            С возвращением
                        </h3>

                        <div className='text-secondary mb-5'>
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
                            className='w-full fw-600 h-11 mb-2'
                            type='submit' 
                            stylingPreset='brand' 
                        >
                            Вход
                        </Button>

                        <div className='self-start'>
                            <span className='fs-14 text-muted mr-1'>
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