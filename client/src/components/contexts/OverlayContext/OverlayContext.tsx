import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, FC, useCallback, useMemo } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { useThrottle, useToggle } from '@hooks';
import { fpsToMs } from '@utils';



export interface IOverlayContext {
    isOverlayExist: boolean;
    openOverlay: () => void;
    closeOverlay: () => void;
    toggleOverlay: () => void;
}

type OverlayContextProviderType = FC<PropsWithChildrenAsNodeOrFunction<IOverlayContext>>;

export const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

export const OverlayContextProvider: OverlayContextProviderType = ({ children }) => {
    const [isOverlayExist, toggle, setIsOverlayExist] = useToggle(false);
    const { isThrottling, throttle } = useThrottle();

    const handleClose = useCallback(() => {
        if (!isOverlayExist) return;
        throttle(() => setIsOverlayExist(false), fpsToMs(60))();
    }, [isOverlayExist, setIsOverlayExist, throttle]);

    const handleOpen = useCallback(() => {
        if (!isThrottling) setIsOverlayExist(true);
    }, [isThrottling, setIsOverlayExist]);

    const handleToggle = useCallback(() => {
        if (!isThrottling) toggle();
    }, [isThrottling, toggle]);

    const contextValues: IOverlayContext = useMemo(() => ({
        isOverlayExist,
        openOverlay: handleOpen,
        closeOverlay: handleClose,
        toggleOverlay: handleToggle,
    }), [handleClose, handleOpen, handleToggle, isOverlayExist]);
    
    return (
        <OverlayContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </OverlayContext.Provider>
    );
};