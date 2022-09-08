import { FC, useRef } from 'react';
import AuthPageBGSrc from '@assets/auth-page-bg.jpg';
import styles from './AuthPage.module.scss';
import { Heading, FormField, Flex, TextInput, Button } from '@components';
import { Form, Formik } from 'formik';
import { Text } from 'src/components/typography';



export const AuthPage: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // useShrinkDetector(containerRef);
    
    return (
        <>
            <div className={styles.wrapper}>
                <img src={AuthPageBGSrc} alt='background decoration' className={styles.bgArt}/>

                <div className={styles.container} ref={containerRef}>
                    <form className={styles.login} hidden>
                        <h3>С возвращением</h3>

                        <Text
                            color='secondary'
                            className='mb-20'
                        >
                                        Мы так рады видеть вас снова!
                        </Text>

                        <div className='field'>
                            <label htmlFor='1' className='label'>
                                Логин
                            </label>

                            <span className='subLabel'></span>

                            <div className='inputContainer'>
                                <input type='text' id='1' className={styles.input} />
                            </div>

                            <p className='errorInfo'></p>

                            <div className='extra'>
                                {/* <button className='variant-link'></button> */}
                            </div>
                        </div>

                        <div className='field'>
                            <label htmlFor='2' className='label'>
                                Пароль
                            </label>

                            <span className='subLabel'></span>

                            <div className='inputContainer'>
                                <input type='text' id='2' className={styles.input} />
                            </div>

                            <p className='errorInfo'></p>

                            <div className='extra'>
                                <button className='variant-link'>
                                    Забыли пароль?
                                </button>
                            </div>
                        </div>

                        <button type='submit'>
                            Вход
                        </button>

                        <div>
                            <p>Нужна учётная запись?</p>
                            
                            <button className='variant-link'>
                                Зарегистрироваться
                            </button>
                        </div>
                    </form>

                    <Formik
                        initialValues={{ email: '', login: '', password: '' }}
                        onSubmit={() => {console.log('wow');}}
                    >
                        {() => (
                            <Form>
                                <Flex 
                                    direction='column' 
                                    align='center' 
                                    gap={20}
                                    className='p-32 br-5 bgc-primary-200'
                                >
                                    <Heading 
                                        level={3} 
                                        size='xl'
                                        fw={600}
                                        color='primary'
                                        className='mb-5'
                                    >
                                        Создать учётную запись
                                    </Heading>

                                    <FormField name='email' label='Адрес электронной почты'>
                                        <TextInput name='email'/>
                                    </FormField>

                                    <FormField name='login' isRequeired label='Логин'>
                                        <TextInput name='login'/>
                                    </FormField>

                                    <FormField name='password' isRequeired label='Пароль'>
                                        <TextInput name='password' type='password'/>
                                    </FormField>

                                    <Flex direction='column' className='w-full' gap={5} align='start'>
                                        <Button type='submit' variant='brand' className='w-full fw-500 h-44'>
                                            Зарегистрироваться
                                        </Button>

                                        <Button variant='link'>
                                            Уже зарегистрированы?
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};