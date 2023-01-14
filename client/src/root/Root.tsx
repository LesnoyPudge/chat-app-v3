import { FC, lazy, Suspense } from 'react';
import { ErrorBoundary, Loader, Masks } from './components';
import './styles/main.scss';
import { useAuthorization, usePageVisibility, usePreventDefault, useThemeSwitcher } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';



const Router = lazy(() => import('./router'));

export const Root: FC = () => {
    usePageVisibility();
    useThemeSwitcher();
    usePreventDefault();
    // useAuthorization();

    return (
        <>
            <Heading className='sr-only'>
                <>ChatApp</>
            </Heading>

            <Masks/>

            <Playground enabled={true}>
                <ErrorBoundary>
                    <Loader>
                        <Suspense>
                            <Router/>
                        </Suspense>
                    </Loader>
                </ErrorBoundary>
            </Playground>
        </>
    );
};