import { createContext, FC, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import errorBgImage from '@assets/error-boundary-bg.svg';
import errorImage from '@assets/error-boundary-image.svg';
import { Button } from '@components';
import { useIsMounted } from '@hooks';
import { secondsToMs } from '@utils';



interface IErorrContext {
    handleReset: (cb: () => void) => void;
    onCrush: () => void;
}

const ErorrContext = createContext<IErorrContext | undefined>(undefined);

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
        }, secondsToMs(30));

        cb();
    };

    const contextValues: IErorrContext = {
        handleReset,
        onCrush,
    };

    return (
        <ErorrContext.Provider value={contextValues}>
            <ReactErrorBoundary FallbackComponent={ErrorFallback}>
                {children}
            </ReactErrorBoundary>
        </ErorrContext.Provider>
    );
};

const ErrorFallback: FC<FallbackProps> = ({ resetErrorBoundary }) => {
    const { handleReset, onCrush } = useContext(ErorrContext) as IErorrContext;
    
    const handleClick = () => handleReset(resetErrorBoundary);

    useEffect(() => {
        onCrush();
    }, [onCrush]);

    return (
        <div className='h-screen w-screen isolate bg-primary-300 text-normal flex'>
            <img 
                className='custom-image-bg-fullscreen'
                src={errorBgImage}
            />

            <div className='flex flex-col m-auto items-center text-center'>
                <img
                    className='mb-5' 
                    src={errorImage}
                />

                <p className='text-heading_l text-primary mb-3 font-semibold'>
                    Как-то неловко получается
                </p>

                <div className='text-muted mb-6'>
                    <p>В приложении возник неожиданный сбой....</p>

                    <p>Мы отследили ошибку и вскоре ей займёмся.</p>
                </div>

                <Button
                    className='font-semibold h-11'
                    variant='brand'
                    onClick={handleClick}
                >
                    Перезагрузить
                </Button>
            </div>
        </div>
    );
};