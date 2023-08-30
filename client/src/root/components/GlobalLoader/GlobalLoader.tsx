import { AnimatedTransition, OverlayPortal } from '@components';
import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';
import { useIsFirstRender, useTimeout } from 'usehooks-ts';
import { Content } from './components';
import { getTransitionOptions } from '@utils';
import { animated } from '@react-spring/web';



interface GlobalLoaderContext {
    finishLoading: () => void;
}

const GlobalLoaderContext = createContext(undefined as unknown as GlobalLoaderContext);

const transitionOptions = getTransitionOptions.empty({
    enter: {
        opacity: 1,
    },
    leave: {
        opacity: 0,
    },
});

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    const contextArgs: GlobalLoaderContext = {
        finishLoading: () => {
            if (!isLoading) return;

            setIsLoading(false);
        },
    };

    useTimeout(() => {
        // setIsLoading(false);
    }, 5000);

    return (
        <GlobalLoaderContext.Provider value={contextArgs}>
            {children}

            <AnimatedTransition
                isExist={isLoading}
                transitionOptions={transitionOptions}
            >
                {({ style, isAnimatedExist }) => (
                    <If condition={isAnimatedExist}>
                        <OverlayPortal>
                            <animated.div
                                className='overlay-item-wrapper'
                                style={style}
                            >
                                <Content/>
                            </animated.div>
                        </OverlayPortal>
                    </If>
                )}
            </AnimatedTransition>
        </GlobalLoaderContext.Provider>
    );
};

const Loaded: FC<PropsWithChildren> = ({ children }) => {
    const { finishLoading } = useContext(GlobalLoaderContext);
    const isFirstRender = useIsFirstRender();

    if (isFirstRender) {
        finishLoading();
    }

    return (
        <>
            {children}
        </>
    );
};

export const GlobalLoader = {
    Wrapper,
    Loaded,
};