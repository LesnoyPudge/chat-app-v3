import { animated } from '@react-spring/web';
import { FC, PropsWithChildren, useContext } from 'react';
import { ScreenShakeContext } from '../ScreenShake';



const styles = {
    wrapper: 'relative h-[100dvh] w-[100dvw] bg-primary-200 overflow-hidden',
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
                {children}
            </animated.div>
        </div>
    );
};