import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, useCallback, useMemo, useRef } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { useThrottle, useToggle } from '@hooks';



export interface IOverlayContext {
    isExist: boolean;
    open: () => void;
    close: (withClick?: boolean) => void;
    toggle: () => void;
}

type OverlayContextProviderType = FC<PropsWithChildrenAsNodeOrFunction<IOverlayContext>>;

export const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

export const OverlayContextProvider: OverlayContextProviderType = ({ children }) => {
    const [isExist, toggle, setIsExist] = useToggle(false);
    const { isThrottling, throttle } = useThrottle();


    const handleClose = useCallback((withClick?: boolean) => {
        if (withClick) return throttle(() => setIsExist(false))();
        setIsExist(false);
    }, [setIsExist, throttle]);

    const handleOpen = useCallback(() => {
        if (!isThrottling) setIsExist(true);
    }, [isThrottling, setIsExist]);

    const handleToggle = useCallback(() => {
        if (!isThrottling) toggle();
    }, [isThrottling, toggle]);

    const contextValues: IOverlayContext = useMemo(() => ({
        isExist,
        open: handleOpen,
        close: handleClose,
        toggle: handleToggle,
    }), [handleClose, handleOpen, handleToggle, isExist]);
    
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