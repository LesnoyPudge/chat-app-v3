import { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';



interface ITooltipContext {
    isOpen: boolean;
    openTooltip: () => void;
    closeTooltip: () => void;
}

interface ITooltipContextProvider {
    children: ReactNode | ((args: ITooltipContext) => JSX.Element);
}

export const TooltipContext = createContext<ITooltipContext | undefined>(undefined);

export const TooltipContextProvider: FC<ITooltipContextProvider> = ({ 
    children, 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openTooltip = () => setIsOpen(true);

    const closeTooltip = () => setIsOpen(false);

    const contextValues: ITooltipContext = useMemo(() => ({
        isOpen,
        openTooltip,
        closeTooltip,
    }), [isOpen]);

    return (
        <TooltipContext.Provider value={contextValues}>
            {children instanceof Function ? children(contextValues) : children}
        </TooltipContext.Provider>
    );
};

export const TooltipListener: FC = () => {
    const { closeTooltip, openTooltip } = useContext(TooltipContext) as ITooltipContext;
    
    return (
        <>

        </>
    );
};