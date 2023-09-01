import { FC } from 'react';
import { Image, TabContextProvider } from '@components';
import { Inner, LoginForm, RegistrationForm } from './components';
import { IMAGES } from '@generated';



const tabs = {
    loginForm: <LoginForm/>,
    registrationForm: <RegistrationForm/>,
};

export type AuthPageTabs = typeof tabs;

export const AuthPage: FC = () => {
    return (
        <div className='page flex relative'>
            <Image
                className='image-bg-fullscreen'
                src={IMAGES.COMMON.FANCY_BG.PATH}
            />

            <TabContextProvider tabs={tabs}>
                <Inner/>
            </TabContextProvider>
        </div>
    );
};