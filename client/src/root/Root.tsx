import { FC, lazy, StrictMode, Suspense } from 'react';
import { ErrorBoundary, Loader, DevDebug, Sprite } from './components';
import { usePreventDefault, useSocketStateHandler } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import './styles/main.scss';



const Router = lazy(() => import('./router'));

const Hooks: FC = () => {
    usePreventDefault();
    useSocketStateHandler();

    return null;
};

const RootInner: FC = () => {
    return (
        <>
            <Hooks/>

            <DevDebug/>

            <Heading className='sr-only'>
                <>ChatApp</>
            </Heading>

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