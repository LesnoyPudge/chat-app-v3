import { FC, StrictMode } from 'react';
import { ErrorBoundary, DevDebug, Sprite, Masks, GlobalLoader } from './components';
import { useInternetState, useMobileMedia, usePreventDefault, useSocketListeners, useSocketStateHandler } from './hooks';
import { Heading, HeadingLevel } from '@libs';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import './styles/main.scss';
import { VisuallyHidden } from '@lesnoypudge/utils-react';
import { Router } from './router';
import { useEventListener } from '@hooks';



const RootInner: FC = () => {
    usePreventDefault();
    useSocketStateHandler();
    useSocketListeners();
    useInternetState();
    useMobileMedia();

    return (
        <>
            <VisuallyHidden>
                <Heading>
                    <>ChatApp</>
                </Heading>
            </VisuallyHidden>

            <Masks/>

            <Sprite/>

            <HeadingLevel>
                <ErrorBoundary>
                    <GlobalLoader.Wrapper>
                        <Router>
                            <DevDebug/>
                        </Router>
                    </GlobalLoader.Wrapper>
                </ErrorBoundary>
            </HeadingLevel>
        </>
    );
};

export const Root: FC = () => {
    return (
        <StrictMode>
            <Provider store={store}>
                <RootInner/>
            </Provider>
        </StrictMode>
    );
};