import { FC, lazy, StrictMode, Suspense } from 'react';
import { ErrorBoundary, Loader, Masks } from './components';
import { useDebug, usePreventDefault, useSocketStateHandler, useThemeSwitcher } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import './styles/main.scss';
import { Provider } from 'react-redux';
import { store } from '@redux/store';



const Router = lazy(() => import('./router'));

const RootInner: FC = () => {
    usePreventDefault();
    useThemeSwitcher();
    useDebug();
    useSocketStateHandler();
    
    return (
        <>
            <Heading className='sr-only'>
                <>ChatApp</>
            </Heading>

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