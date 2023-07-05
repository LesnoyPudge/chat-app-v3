import { Conditional, OverlayPortal } from '@components';
import { createContext, FC, PropsWithChildren, useState } from 'react';



export interface LoadingContext {
    finishLoading: () => void;
}

export const LoadingContext = createContext<LoadingContext | undefined>(undefined);

export const Loader: FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    const finishLoading = () => {
        isLoading && setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ finishLoading }}>
            {children}

            <Conditional isRendered={isLoading}>
                <OverlayPortal>
                    <div className='grid place-items-center w-full h-full bg-primary-300 pointer-events-auto'>
                        <div className='h-full flex flex-col text-center'>
                            <div className='mt-auto'>
                                <p>Loading...</p>
                            </div>

                            <div className='mt-auto grid mb-8'>
                                <p>Проблемы с подключением? Сообщите нам! </p>
                            </div>
                        </div>
                    </div>
                </OverlayPortal>
            </Conditional>
        </LoadingContext.Provider> 
    );
};