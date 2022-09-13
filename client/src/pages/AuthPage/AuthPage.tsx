import { FC, useRef } from 'react';
import AuthPageBGSrc from '@assets/auth-page-bg.jpg';
import { TabContexProvider } from '@components';
import { LoginForm, RegistrationForm } from './tabs';
import { animated, useTransition } from '@react-spring/web';



export const AuthPage: FC = () => {
    const someRef = useRef<string | null>(null);
    const transitions = useTransition(someRef.current, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });
    
    return (
        <div className='flex h-screen isolate'>
            <img src={AuthPageBGSrc} className='custom-image-bg-fullscreen'/>

            <div className='p-8 rounded bg-primary-200 m-auto w-[480px]'>
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
                >
                    {({ currentTab, tabs }) => {
                        someRef.current = currentTab.identifier;

                        return (
                            <>
                                {
                                    tabs.map(({ identifier, tab }) => {
                                        const isCurrent = currentTab.identifier === identifier;
                                            
                                        return transitions(({ opacity }, item) => (
                                            <animated.div 
                                                style={{
                                                    opacity: opacity,
                                                    display: isCurrent ? '' : 'none',
                                                }}
                                                key={identifier}
                                            >
                                                {tab}
                                            </animated.div>
                                        ));
                                        // return (
                                        //     <div key={identifier} className={`contents ${!isCurrent ? 'hidden' : ''}`}>
                                        //         {tab}
                                        //     </div>
                                        // );
                                    })
                                }
                            </>
                        );
                    }}
                </TabContexProvider>
            </div>
        </div>
    );
};