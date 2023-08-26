import { FC, lazy, StrictMode, Suspense } from 'react';
import { ErrorBoundary, Loader, DevDebug, Sprite, Masks } from './components';
import { usePreventDefault, useSocketListeners, useSocketStateHandler } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import './styles/main.scss';



const Router = lazy(() => import('./router'));

const RootInner: FC = () => {
    usePreventDefault();
    useSocketStateHandler();
    useSocketListeners();

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
                        <Loader>
                            <Suspense>
                                <Router/>
                            </Suspense>
                        </Loader>
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