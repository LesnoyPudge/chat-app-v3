import { FC } from 'react';
import fancyBgSrc from '@assets/backgrounds/fancy-bg.jpg';
import { Image, TabContextProvider } from '@components';
import { Inner, LoginForm, RegistrationForm } from './components';



const tabs = {
    loginForm: <LoginForm/>,
    registrationForm: <RegistrationForm/>,
};

export type AuthPageTabs = typeof tabs;

export const AuthPage: FC = () => {
    return (
        <div className='flex h-screen isolate relative'>
            <Image
                className='image-bg-fullscreen'
                src={fancyBgSrc}
            />

            <TabContextProvider tabs={tabs}>
                <Inner/>
            </TabContextProvider>
        </div>
    );
};