import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, RefObject, useEffect, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction, Conditional } from '@components';



interface RefContextProvider extends PropsWithChildrenAsNodeOrFunction {
    providedRef?: RefObject<HTMLElement>;
}

export interface RefContextV2 {
    targetRef: RefObject<HTMLElement>;
}

export const RefContextV2 = createContext<RefContextV2 | undefined>(undefined);

export const RefContextProviderV2: FC<RefContextProvider> = ({
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
    
    const contextValues: RefContextV2 = {
        targetRef: providedRef ? providedRef : targetRef,
    };

    return (
        <>
            <Conditional isRendered={!targetRef.current && !providedRef}>
                <div className='hidden' ref={wrapperRef}></div>
            </Conditional>

            <RefContextV2.Provider value={contextValues}>
                <ChildrenAsNodeOrFunction args={contextValues}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </RefContextV2.Provider>
        </>
    );
};