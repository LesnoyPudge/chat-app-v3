import {  OverlayPortal } from '@components';
import { createContext, FC, PropsWithChildren, useState } from 'react';



export interface LoadingContext {
    finishLoading: () => void;
}

export const LoadingContext = createContext(undefined as unknown as LoadingContext);

export const Loader: FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    const finishLoading = () => {
        isLoading && setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ finishLoading }}>
            {children}

            <If condition={isLoading}>
                <OverlayPortal>
                    <div className='grid place-items-center w-full h-full bg-primary-300 pointer-events-auto'>
                        <div className='h-full flex flex-col text-center'>
                            <div className='mt-auto'>
                                <>Загрузка</>
                            </div>

                            <div className='mt-auto mb-8'>
                                <>Проблемы с подключением? Сообщите нам!</>
                            </div>
                        </div>
                    </div>
                </OverlayPortal>
            </If>
        </LoadingContext.Provider>
    );
};