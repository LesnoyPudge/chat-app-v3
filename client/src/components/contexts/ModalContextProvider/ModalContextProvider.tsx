import { createContext, FC, ReactNode, useCallback, useMemo, useState } from 'react';



export interface IModalContext {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

interface IModalContextProvider {
    children: ReactNode | ((args: IModalContext) => JSX.Element);
}

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const ModalContextProvider: FC<IModalContextProvider> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    const contextValues: IModalContext = useMemo(() => ({
        isOpen,
        openModal,
        closeModal,
    }), [closeModal, isOpen, openModal]);
    
    const content = useMemo(() => {
        return children instanceof Function ? children(contextValues) : children;
    }, [children, contextValues]);

    return (
        <ModalContext.Provider value={contextValues}>
            {content}
        </ModalContext.Provider>
    );
};