import { createContext, FC, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import errorBgImage from '@assets/backgrounds/error-boundary-bg.svg';
import errorImage from '@assets/error-boundary-image.svg';
import { Button, Image } from '@components';
import { secondsToMs } from '@utils';
import { useIsMounted } from 'usehooks-ts';



interface ErorrContext {
    handleReset: (cb: () => void) => void;
    onCrush: () => void;
}

const ErorrContext = createContext<ErorrContext | undefined>(undefined);

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

    const contextValues: ErorrContext = {
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
    const { handleReset, onCrush } = useContext(ErorrContext) as ErorrContext;
    
    const handleClick = () => handleReset(resetErrorBoundary);

    useEffect(() => {
        onCrush();
    }, [onCrush]);

    return (
        <div className='h-screen w-screen isolate bg-primary-300 text-color-base flex'>
            <Image
                className='image-bg-fullscreen'
                src={errorBgImage}
            />

            <div className='flex flex-col m-auto items-center text-center'>
                <Image
                    className='mb-5' 
                    src={errorImage}
                />

                <p className='text-xl text-color-primary mb-3 font-semibold'>
                    Как-то неловко получается
                </p>

                <div className='text-color-muted mb-6'>
                    <p>В приложении возник неожиданный сбой....</p>

                    <p>Мы отследили ошибку и вскоре ей займёмся.</p>
                </div>

                <Button
                    className='font-semibold h-11'
                    stylingPreset='brand'
                    onLeftClick={handleClick}
                >
                    Перезагрузить
                </Button>
            </div>
        </div>
    );
};