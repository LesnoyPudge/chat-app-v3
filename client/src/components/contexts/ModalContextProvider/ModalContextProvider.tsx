import { ChildrenAsNodeOrFunction } from '@components';
import { useToggle } from '@hooks';
import { createContext, FC, ReactNode, useMemo, useRef, useState } from 'react';



export interface IModalContext {
    isOpen: boolean;
    isEscapeBlocked: boolean;
    openModal: () => void;
    closeModal: () => void;
    toggleModal: () => void;
    updateEscapeBlock: (isBlocked: boolean) => void;
}

interface IModalContextProvider {
    children: ReactNode | ((args: IModalContext) => JSX.Element);
}

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const ModalContextProvider: FC<IModalContextProvider> = ({ children }) => {
    const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);
    const [isEscapeBlocked, setIsEscapeBlocked] = useState(false);

    const contextValues: IModalContext = useMemo(() => ({
        isOpen,
        isEscapeBlocked,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
        toggleModal: toggleIsOpen,
        updateEscapeBlock: setIsEscapeBlocked,
    }), [isEscapeBlocked, isOpen, setIsOpen, toggleIsOpen, setIsEscapeBlocked]);

    return (
        <ModalContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </ModalContext.Provider>
    );
};