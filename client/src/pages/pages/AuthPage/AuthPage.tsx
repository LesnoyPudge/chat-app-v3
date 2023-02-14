import { FC } from 'react';
import fancyBgSrc from '@assets/backgrounds/fancy-bg.jpg';
import { Image, TabContextProvider } from '@components';
import { LoginForm, RegistrationForm } from './tabs';



const tabs = {
    loginForm: <LoginForm/>,
    registrationForm: <RegistrationForm/>,
};

export type AuthPageTabs = typeof tabs;

export const AuthPage: FC = () => {
    return (
        <div className='flex h-screen isolate'>
            <Image
                className='image-bg-fullscreen'
                src={fancyBgSrc}
            />

            <div className='p-8 m-auto w-[480px] rounded bg-primary-200 shadow-elevation-high'>
                <TabContextProvider tabs={tabs}>
                    {({ currentTab }) => (
                        <>{currentTab.tab}</>
                    )}
                </TabContextProvider>
            </div>
        </div>
    );
};