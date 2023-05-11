import '@total-typescript/ts-reset';
import { FC, lazy, StrictMode, Suspense } from 'react';
import { ErrorBoundary, Loader, Masks } from './components';
import { useAuthorization, useDebug, usePageVisibility, usePreventDefault, useThemeSwitcher } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import './styles/main.scss';
import { Provider } from 'react-redux';
import { store } from '@redux/store';



const Router = lazy(() => import('./router'));

const RootInner: FC = () => {
    usePageVisibility();
    usePreventDefault();
    // useAuthorization();
    useThemeSwitcher();
    useDebug();
    
    return (
        <Provider store={store}>
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
        </Provider>
    );
};

export const Root: FC = () => {
    return (
        <StrictMode>
            <RootInner/>
        </StrictMode>
    );
};