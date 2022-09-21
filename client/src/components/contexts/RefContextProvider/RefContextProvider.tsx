import { createContext, FC, PropsWithChildren, RefObject, useEffect, useRef } from 'react';



export interface IRefContext {
    container: RefObject<HTMLDivElement>;
    target: RefObject<HTMLElement>;
}

export const RefContext = createContext<IRefContext | undefined>(undefined);

export const RefContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || !containerRef.current.firstElementChild) return;
        targetRef.current = containerRef.current.firstElementChild as HTMLElement;
    }, []);
    
    return (
        <div 
            className='contents'
            ref={containerRef}
        >
            <RefContext.Provider value={{
                container: containerRef,
                target: targetRef,
            }}>
                {children}
            </RefContext.Provider>
        </div>
    );
};