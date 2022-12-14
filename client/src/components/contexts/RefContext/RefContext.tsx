import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, RefObject, useEffect, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction, Conditional } from '@components';



interface RefContextProvider extends PropsWithChildrenAsNodeOrFunction<RefContext> {
    providedRef?: RefObject<HTMLElement>;
}

export interface RefContext {
    targetRef: RefObject<HTMLElement>;
}

export const RefContext = createContext<RefContext | undefined>(undefined);

export const RefContextProvider: FC<RefContextProvider> = ({
    providedRef,
    children,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [targetRef, setTargetRef] = useState(useRef<HTMLElement | null>(null));

    useEffect(() => {
        if (!wrapperRef.current || !wrapperRef.current.nextElementSibling) return;

        const wrapper = wrapperRef.current.nextElementSibling as HTMLElement;
        setTargetRef({ current: wrapper });
    }, []);
    
    const contextValues: RefContext = {
        targetRef: providedRef ? providedRef : targetRef,
    };

    return (
        <>
            <Conditional isRendered={!targetRef.current && !providedRef}>
                <span className='hidden' ref={wrapperRef}></span>
            </Conditional>

            <RefContext.Provider value={contextValues}>
                <ChildrenAsNodeOrFunction args={contextValues}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </RefContext.Provider>
        </>
    );
};