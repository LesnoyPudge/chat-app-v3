import { FC } from 'react';
import fancyBgSrc from '@assets/backgrounds/fancy-bg.jpg';
import { Image, TabContextProvider } from '@components';
import { LoginForm, RegistrationForm } from './tabs';



export const AuthPage: FC = () => {
    return (
        <div className='flex h-screen isolate'>
            <Image
                className='image-bg-fullscreen'
                src={fancyBgSrc}
            />

            <div className='flex flex-col p-8 max-[480px]:px-4 m-auto w-[480px] rounded bg-primary-200 shadow-elevation-high'>
                <TabContextProvider 
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
                    {({ currentTab }) => (
                        <>{currentTab.tab}</>
                    )}
                </TabContextProvider>
            </div>
        </div>
    );
};

// const Tab: FC<{identifier: string}> = ({ identifier }) => {
//     const { currentTab } = useContext(TabContext) as TabContext;
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