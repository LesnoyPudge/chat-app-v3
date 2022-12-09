import { Button, ITabContext, TabContex, TextInput } from '@components';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';



export const LoginForm: FC = () => {
    const { changeTab } = useContext(TabContex) as ITabContext;
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

                        <TextInput
                            label='Логин'
                            name='login'
                            isRequired
                            placeholder='myLogin'
                            className='mb-5'
                        />

                        <TextInput
                            label='Пароль'
                            name='password'
                            type='password'
                            isRequired
                            placeholder='myPassword'
                            className='mb-5'
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