import { Conditional, OverlayLayer } from '@components';
import { createContext, FC, PropsWithChildren, useState } from 'react';



export interface ILoadingContext {
    finishLoading: () => void;
}

export const LoadingContext = createContext<ILoadingContext | undefined>(undefined);

export const Loader: FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    const finishLoading = () => {
        isLoading && setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ finishLoading }}>
            {children}

            <Conditional isRendered={isLoading}>
                <OverlayLayer>
                    <div className='grid place-items-center w-full h-full bg-primary-300 pointer-events-auto'>
                        <div className='h-full flex flex-col text-center'>
                            <div className='mt-auto'>
                                <p>Loading...</p>
                            </div>

                            <div className='mt-auto grid mb-8'>
                                <p>Проблемы с подключением? Сообщите нам!</p>

                                <div className='mt-2'>
                                    <a 
                                        href='https://twitter.com/discord' 
                                        rel='noopener noreferrer' 
                                        target='_blank'
                                    >
                                        <span>Напишите нам в Твиттере</span>
                                    </a>

                                    <a
                                        className='ml-5'
                                        href='https://discordstatus.com' 
                                        rel='noopener noreferrer' 
                                        target='_blank'
                                    >
                                        <span>Состояние сервера</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </OverlayLayer>
            </Conditional>
        </LoadingContext.Provider> 
    );
};