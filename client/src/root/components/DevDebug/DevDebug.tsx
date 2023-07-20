import { getEnv } from '@utils';
import { FC, Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';



const DevDebugInner = lazy(() => import('./DevDebugInner'));

export const DevDebug: FC = () => {
    if (getEnv().CUSTOM_NODE_ENV === 'production') return null;

    return (
        <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
                <DevDebugInner/>
            </Suspense>
        </ErrorBoundary>
    );
};