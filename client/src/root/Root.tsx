import { FC, lazy, Suspense } from 'react';
import { ErrorBoundary, Loader, Masks } from './components';
import { useAuthorization, useDebug, usePageVisibility, usePreventDefault, useThemeSwitcher } from './hooks';
import { Playground } from './playground';
import { Heading, HeadingLevel } from '@libs';
import './styles/main.scss';



const Router = lazy(() => import('./router'));

export const Root: FC = () => {
    usePageVisibility();
    usePreventDefault();
    // useAuthorization();
    useThemeSwitcher();
    useDebug();
    
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