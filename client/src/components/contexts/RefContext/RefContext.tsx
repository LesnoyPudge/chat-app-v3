import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, RefObject, useEffect, useRef, useState } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



interface RefContextProvider extends PropsWithChildrenAsNodeOrFunction<RefContext> {
    providedRef?: RefObject<HTMLElement>;
}

interface RefContext {
    targetRef: RefObject<HTMLElement>;
}

const RefContext = createContext(undefined as unknown as RefContext);
export {};
const RefContextProvider: FC<RefContextProvider> = ({
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
            <If condition={!targetRef.current && !providedRef}>
                <span className='hidden' ref={wrapperRef}></span>
            </If>

            <RefContext.Provider value={contextValues}>
                <ChildrenAsNodeOrFunction args={contextValues}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </RefContext.Provider>
        </>
    );
};