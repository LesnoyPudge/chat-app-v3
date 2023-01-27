import { AnimatedTransition, Button, Conditional } from '@components';
import { animated } from '@react-spring/web';
import { getTransitionOptions, twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC, useContext } from 'react';
import { ScreenShakeContext } from '..';



const styles = {
    wrapper: `absolute max-w-[740px] px-5 pb-5 left-0 
    right-0 bottom-0 pointer-events-none`,
    inner: {
        base: `flex w-full items-center gap-2.5 p-2.5 rounded-md 
        bg-primary-500 shadow-elevation-high transition-all`,
        active: 'pointer-events-auto',
        throttle: 'bg-danger text-white',
    },
    text: 'font-medium truncate mr-auto',
};

const transitionOptions = getTransitionOptions.inOut({});

export const FormConfirmationBar: FC = () => {
    const { dirty } = useFormikContext();
    const { isThrottling } = useContext(ScreenShakeContext) as ScreenShakeContext;

    return (
        <AnimatedTransition isExist={dirty} transitionOptions={transitionOptions}>
            {({ style, isAnimatedExist }) => {
                return (
                    <Conditional isRendered={isAnimatedExist}>
                        <animated.div 
                            className={styles.wrapper}
                            aria-live='polite'
                            style={{
                                translateY: style.value.to({
                                    range: dirty ? [0, 0.8, 1] : [0, 0.1, 1],
                                    output: dirty ? [100, -30, 0] : [100, -65, 0],
                                }).to((value) => `${value}%`),
                            }}
                        >
                            <div className={twClassNames(
                                styles.inner.base,
                                { 
                                    [styles.inner.active]: style.value.idle, 
                                    [styles.inner.throttle]: isThrottling,
                                },
                            )}>
                                <div className={styles.text}>
                                    <>Аккуратнее, вы не сохранили изменения!</>
                                </div>
    
                                <Button
                                    stylingPreset='lite'
                                    size='small'
                                    type='reset'
                                >
                                    <>Сброс</>
                                </Button>
    
                                <Button
                                    stylingPreset='brandPositive'
                                    size='small'
                                    type='submit'
                                >
                                    <>Сохранить изменения</>
                                </Button>
                            </div>
                        </animated.div>
                    </Conditional>
                );
            }}
        </AnimatedTransition>
    );
};


