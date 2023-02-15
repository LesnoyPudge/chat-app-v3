import { FC, useContext } from 'react';
import fancyBgSrc from '@assets/backgrounds/fancy-bg.jpg';
import { AnimatedTransition, Conditional, Image, TabContext, TabContextProvider } from '@components';
import { LoginForm, RegistrationForm } from './tabs';
import { animated, SpringValue } from '@react-spring/web';
import { MoveFocusInside } from 'react-focus-lock';
import { getTransitionOptions } from '@utils';



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
                <Content/>
            </TabContextProvider>
        </div>
    );
};

const styles = {
    wrapper: 'absolute inset-0 flex',
    item: 'p-8 m-auto w-[480px] rounded bg-primary-200 shadow-elevation-high',
};

const DURATION = 125;
    
const getOptions = (show: boolean) => {
    return getTransitionOptions.inOut({
        delay: show ? DURATION : 0,
        config: {
            duration: DURATION,
        },
        initial: { value: 1 },
    });
};

const getStyle = (style: {value: SpringValue<number>}, show: boolean) => ({
    translateY: style.value.to({
        range: show ? [0, 1] : [0, 1],
        output: show ? [-8, 0] : [-8, 0],
    }).to((value) => `${value}%`),
    opacity: style.value.to({
        range: [0, 1],
        output: [0, 1],
    }),
    scale: style.value.to({
        range: [0, 1],
        output: [1.02, 1],
    }),
});

const Content: FC = () => {
    const { isActive, tabs } = useContext(TabContext) as TabContext<AuthPageTabs>;

    const showLoginForm = isActive.loginForm;
    const showRegistrationForm = isActive.registrationForm;

    return (
        <>
            <AnimatedTransition 
                isExist={showLoginForm} 
                transitionOptions={getOptions(showLoginForm)}
            >
                {({ isAnimatedExist, style }) => (
                    <Conditional isRendered={isAnimatedExist}>
                        <MoveFocusInside>
                            <div className={styles.wrapper}>
                                <animated.div 
                                    className={styles.item} 
                                    style={getStyle(style, showLoginForm)}
                                >
                                    {tabs.loginForm.tab}
                                </animated.div>
                            </div>
                        </MoveFocusInside>
                    </Conditional>
                )}
            </AnimatedTransition>

            <AnimatedTransition 
                isExist={showRegistrationForm} 
                transitionOptions={getOptions(showRegistrationForm)}
            >
                {({ isAnimatedExist, style }) => (
                    <Conditional isRendered={isAnimatedExist}>
                        <MoveFocusInside>
                            <div className={styles.wrapper}>
                                <animated.div 
                                    className={styles.item} 
                                    style={getStyle(style, showRegistrationForm)}
                                >
                                    {tabs.registrationForm.tab}
                                </animated.div>
                            </div>
                        </MoveFocusInside>
                    </Conditional>
                )}
            </AnimatedTransition>
        </>
    );
};