import { animated } from '@react-spring/web';
import { FC, PropsWithChildren } from 'react';
import { FullScreenModalContext } from '../FullScreenModalContextProvider';
import { useContextProxy } from '@lesnoypudge/utils-react';



const styles = {
    wrapper: 'relative h-dvh w-dvw bg-primary-200 overflow-hidden',
    inner: `flex absolute inset-0 will-change-transform transition-transform 
    ease-linear duration-[20ms]`,
};

export const FullScreenModalWrapper: FC<PropsWithChildren> = ({
    children,
}) => {
    const { getWindowShakeValue } = useContextProxy(FullScreenModalContext)
    
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