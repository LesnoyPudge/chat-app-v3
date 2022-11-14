import { FC, useContext, useRef } from 'react';
import AuthPageBGSrc from '@assets/auth-page-bg.jpg';
import { ITabContext, TabContex, TabContexProvider } from '@components';
import { LoginForm, RegistrationForm } from './tabs';
import { animated, useTransition } from '@react-spring/web';
import classNames from 'classnames';



export const AuthPage: FC = () => {
    const someRef = useRef<string | null>(null);
    
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
                                        // return <Tab identifier={identifier} key={identifier}/>;
                                        
                                        return (
                                            <div key={identifier} className={classNames(
                                                'contents',
                                                {
                                                    'hidden': currentTab.identifier !== identifier,
                                                },
                                            )}>
                                                {tab}
                                            </div>
                                        );
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

// const Tab: FC<{identifier: string}> = ({ identifier }) => {
//     const { currentTab } = useContext(TabContex) as ITabContext;
//     const transitions = useTransition(identifier === currentTab.identifier, {
//         from: { opacity: 0 },
//         enter: { opacity: 1 },
//         leave: { opacity: 0 },
//     });

//     return transitions(({ opacity }, item) => (
//         <animated.div 
//             style={{
//                 opacity: opacity,
//                 display: item ? '' : 'none',
//             }}
//             key={identifier}
//         >
//             {currentTab.tab}
//         </animated.div>                            
//     ));
// };