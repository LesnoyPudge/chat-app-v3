import { PropsWithChildrenAsNodeOrFunction } from '@types';
import React, { createContext, FC, useCallback, useMemo } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { useThrottle, useToggle } from '@hooks';
import { fpsToMs } from '@utils';



export interface OverlayContext {
    isOverlayExist: boolean;
    closingThrottle: boolean;
    openOverlay: () => void;
    closeOverlay: () => void;
    toggleOverlay: () => void;
}

interface OverlayContextProvider extends PropsWithChildrenAsNodeOrFunction<OverlayContext> {
    isOverlayExistInitial?: boolean;
}

export const OverlayContext = createContext<OverlayContext | undefined>(undefined);

export const OverlayContextProvider: FC<OverlayContextProvider> = ({ 
    children,
    isOverlayExistInitial = false,
}) => {
    const [isOverlayExist, toggle, setIsOverlayExist] = useToggle(isOverlayExistInitial);
    const { isThrottling, throttle } = useThrottle();

    const handleClose = useCallback(() => {
        if (!isOverlayExist) return;
        throttle(() => {
            setIsOverlayExist(false);
        }, fpsToMs(60))();
    }, [isOverlayExist, setIsOverlayExist, throttle]);

    const handleOpen = useCallback(() => {
        if (isThrottling) return;
        setIsOverlayExist(true);
    }, [isThrottling, setIsOverlayExist]);

    const handleToggle = useCallback(() => {
        if (isThrottling) return;
        toggle();
    }, [isThrottling, toggle]);

    const contextValues: OverlayContext = useMemo(() => ({
        isOverlayExist,
        closingThrottle: isThrottling,
        openOverlay: handleOpen,
        closeOverlay: handleClose,
        toggleOverlay: handleToggle,
    }), [handleClose, handleOpen, handleToggle, isOverlayExist, isThrottling]);
    
    return (
        <OverlayContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </OverlayContext.Provider>
    );
};