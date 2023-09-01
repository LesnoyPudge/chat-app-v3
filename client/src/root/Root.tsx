import { FC, lazy, StrictMode, Suspense } from 'react';
import { ErrorBoundary, DevDebug, Sprite, Masks, GlobalLoader } from './components';
import { useInternetState, usePreventDefault, useSocketListeners, useSocketStateHandler } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import './styles/main.scss';
import Router from './router';



// const Router = lazy(() => import('./router'));


const RootInner: FC = () => {
    usePreventDefault();
    useSocketStateHandler();
    useSocketListeners();
    useInternetState();

    return (
        <>
            <DevDebug/>

            <Heading className='sr-only'>
                <>ChatApp</>
            </Heading>

            <Masks/>

            <Sprite/>

            <HeadingLevel>
                <Playground>
                    <ErrorBoundary>
                        <GlobalLoader.Wrapper>
                            {/* <Suspense> */}
                            <Router/>
                            {/* </Suspense> */}
                        </GlobalLoader.Wrapper>
                    </ErrorBoundary>
                </Playground>
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