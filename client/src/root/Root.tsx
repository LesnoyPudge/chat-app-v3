import { FC, lazy, Suspense } from 'react';
import { ErrorBoundary, Loader, Masks } from './components';
import './styles/main.scss';
import { useAuthorization, usePageVisibility, usePreventDefault, useThemeSwitcher } from './hooks';



const RootRouter = lazy(() => import('./router'));

export const Root: FC = () => {
    usePageVisibility();
    useThemeSwitcher();
    usePreventDefault();
    useAuthorization();

    return (
        <ErrorBoundary>
            <Masks/>

            <Loader>
                <Suspense>
                    <RootRouter/>
                </Suspense>
            </Loader>
        </ErrorBoundary>
    );
};