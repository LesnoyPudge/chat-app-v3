import { createContext, FC, ReactNode, useCallback, useMemo, useState } from 'react';



export interface IModalContext {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    toggleModal: () => void;
}

interface IModalContextProvider {
    children: ReactNode | ((args: IModalContext) => JSX.Element);
}

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const ModalContextProvider: FC<IModalContextProvider> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);
    const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

    const contextValues: IModalContext = useMemo(() => ({
        isOpen,
        openModal,
        closeModal,
        toggleModal,
    }), [closeModal, isOpen, openModal, toggleModal]);
    
    const content = useMemo(() => {
        return children instanceof Function ? children(contextValues) : children;
    }, [children, contextValues]);

    return (
        <ModalContext.Provider value={contextValues}>
            {content}
        </ModalContext.Provider>
    );
};