import { AnimatedTransition, OverlayPortal } from '@components';
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getTransitionOptions } from '@utils';
import { animated } from '@react-spring/web';
import { useLatest } from '@hooks';
import { useMemoSelector } from '@redux/hooks';
import { AppSelectors } from '@redux/features';
import { GlobalLoaderPage } from '@pages/GlobalLoaderPage';



interface GlobalLoaderContext {
    finishLoading: () => void;
}

const GlobalLoaderContext = createContext(undefined as unknown as GlobalLoaderContext);

const transitionOptions = getTransitionOptions.empty({
    enter: {
        opacity: 1,
        scale: 1,
    },
    leave: {
        opacity: 0,
        scale: 1.5,
    },
});

const styles = {
    overlay: 'overlay-item-wrapper',
};

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const isLoadingRef = useLatest(isLoading);

    const finishLoading = useCallback(() => {
        if (!isLoadingRef.current) return;

        setIsLoading(false);
    }, [isLoadingRef]);

    const contextArgs: GlobalLoaderContext = {
        finishLoading,
    };

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
                                className={styles.overlay}
                                style={style}
                            >
                                <GlobalLoaderPage/>
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
    const isOnline = useMemoSelector(AppSelectors.selectIsOnline);

    useEffect(() => {
        if (!isOnline) return;
        finishLoading();
    }, [isOnline, finishLoading]);

    return (
        <>
            {children}
        </>
    );
};

const LoadedForced: FC<PropsWithChildren> = ({ children }) => {
    const { finishLoading } = useContext(GlobalLoaderContext);

    useEffect(() => {
        finishLoading();
    }, [finishLoading]);

    return (
        <>
            {children}
        </>
    );
};

export const GlobalLoader = {
    Wrapper,
    Loaded,
    LoadedForced,
};