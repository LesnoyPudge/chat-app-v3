import { FC, lazy, StrictMode, Suspense } from 'react';
import { ErrorBoundary, Loader, Masks, DevDebug, Sprite } from './components';
import { usePreventDefault, useSocketStateHandler } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import './styles/main.scss';



const Router = lazy(() => import('./router'));

const RootInner: FC = () => {
    usePreventDefault();
    useSocketStateHandler();

    return (
        <>
            <DevDebug/>

            <Heading className='sr-only'>
                <>ChatApp</>
            </Heading>

            <Sprite/>

            <Masks/>

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