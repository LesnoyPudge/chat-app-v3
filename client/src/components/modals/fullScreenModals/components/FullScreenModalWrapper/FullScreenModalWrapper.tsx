import { animated } from '@react-spring/web';
import { FC, PropsWithChildren, useContext } from 'react';
import { ScreenShakeContext } from '../ScreenShake';
import { FullScreenModalContextProvider } from '../FullScreenModalContextProvider';



const styles = {
    wrapper: 'relative h-dvh w-dvw bg-primary-200 overflow-hidden',
    inner: `flex absolute inset-0 will-change-transform transition-transform 
    ease-linear duration-[20ms]`,
};

export const FullScreenModalWrapper: FC<PropsWithChildren> = ({
    children,
}) => {
    const {getWindowShakeValue} = useContext(ScreenShakeContext)

    return (
        <div className={styles.wrapper}>
            <animated.div
                className={styles.inner}
                style={{
                    translateX: getWindowShakeValue(),
                    translateY: getWindowShakeValue(),
                }}
            >
                <FullScreenModalContextProvider>
                    {children}
                </FullScreenModalContextProvider>
            </animated.div>
        </div>
    );
};