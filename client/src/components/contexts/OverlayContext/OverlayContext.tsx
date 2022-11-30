import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, useMemo } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { useToggle } from '@hooks';



export interface IOverlayContext {
    isExist: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

type OverlayContextProviderType = FC<PropsWithChildrenAsNodeOrFunction<IOverlayContext>>;

export const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

export const OverlayContextProvider: OverlayContextProviderType = ({ children }) => {
    const [isExist, toggle, setIsExist] = useToggle(false);

    const contextValues: IOverlayContext = useMemo(() => ({
        isExist,
        open: () => setIsExist(true),
        close: () => setIsExist(false),
        toggle,
    }), [isExist, setIsExist, toggle]);
    
    return (
        <>
            <OverlayContext.Provider value={contextValues}>
                <ChildrenAsNodeOrFunction args={contextValues}>
                    {children}
                </ChildrenAsNodeOrFunction>
            </OverlayContext.Provider>
        </>
    );
};