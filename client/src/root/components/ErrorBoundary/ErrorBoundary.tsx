import { createContext, FC, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useIsMounted } from 'usehooks-ts';
import { ErrorPage } from '@pages/ErrorPage';



interface ErrorContext {
    handleReset: (cb: () => void) => void;
    onCrush: () => void;
}

const ErrorContext = createContext(undefined as unknown as ErrorContext);

export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
    const isMounted = useIsMounted();
    const isCrushedRef = useRef(false);

    const onCrush = () => {
        if (!isCrushedRef.current) return;
        window.location.reload();
    };

    const handleReset = (cb: () => void) => {
        isCrushedRef.current = true;

        setTimeout(() => {
            if (!isMounted()) return;
            isCrushedRef.current = false;
        }, 30 * 1000);

        cb();
    };

    const contextValues: ErrorContext = {
        handleReset,
        onCrush,
    };

    return (
        <ErrorContext.Provider value={contextValues}>
            <ReactErrorBoundary FallbackComponent={ErrorFallback}>
                {children}
            </ReactErrorBoundary>
        </ErrorContext.Provider>
    );
};

const ErrorFallback: FC<FallbackProps> = ({ resetErrorBoundary }) => {
    const { handleReset, onCrush } = useContext(ErrorContext);

    const handleReload = () => handleReset(resetErrorBoundary);

    useEffect(() => {
        onCrush();
    }, [onCrush]);

    return (
        <ErrorPage onReload={handleReload}/>
    );
};