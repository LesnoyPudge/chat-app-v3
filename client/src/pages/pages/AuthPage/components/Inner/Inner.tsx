import { FC, useContext } from 'react';
import { AnimatedTransition, TabContext , MoveFocusInside } from '@components';
import { animated, SpringValue } from '@react-spring/web';
import { getTransitionOptions } from '@utils';
import { AuthPageTabs } from '@pages/AuthPage/AuthPage';




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

export const Inner: FC = () => {
    const { isActive, tabs } = useContext<TabContext<AuthPageTabs>>(TabContext);

    const showLoginForm = isActive.loginForm;
    const showRegistrationForm = isActive.registrationForm;

    return (
        <>
            <AnimatedTransition
                isExist={showLoginForm}
                transitionOptions={getOptions(showLoginForm)}
            >
                {({ isAnimatedExist, style }) => (
                    <If condition={isAnimatedExist}>
                        <MoveFocusInside enabled>
                            <div className={styles.wrapper}>
                                <animated.div
                                    className={styles.item}
                                    style={getStyle(style, showLoginForm)}
                                >
                                    {tabs.loginForm.tab}
                                </animated.div>
                            </div>
                        </MoveFocusInside>
                    </If>
                )}
            </AnimatedTransition>

            <AnimatedTransition
                isExist={showRegistrationForm}
                transitionOptions={getOptions(showRegistrationForm)}
            >
                {({ isAnimatedExist, style }) => (
                    <If condition={isAnimatedExist}>
                        <MoveFocusInside enabled>
                            <div className={styles.wrapper}>
                                <animated.div
                                    className={styles.item}
                                    style={getStyle(style, showRegistrationForm)}
                                >
                                    {tabs.registrationForm.tab}
                                </animated.div>
                            </div>
                        </MoveFocusInside>
                    </If>
                )}
            </AnimatedTransition>
        </>
    );
};