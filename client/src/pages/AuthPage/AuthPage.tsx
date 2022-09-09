import { FC } from 'react';
import AuthPageBGSrc from '@assets/auth-page-bg.jpg';
import { TabContexProvider } from '@components';
import { LoginForm, RegistrationForm } from './tabs';



export const AuthPage: FC = () => {
    return (
        <>
            <div className='flex h-screen isolate'>
                <img src={AuthPageBGSrc} className='custom-image-bg-fullscreen'/>

                <div className='p-8 sm:px-4 rounded bg-primary-200 m-auto'>
                    <TabContexProvider 
                        tabs={[
                            { 
                                identifier: 'LoginForm', 
                                tab: <LoginForm/>, 
                            }, 
                            { 
                                identifier: 'RegistrationForm', 
                                tab: <RegistrationForm/>, 
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
};