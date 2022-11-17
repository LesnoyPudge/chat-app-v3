import { ChildrenOrFunction } from '@components';
import { useToggle } from '@hooks';
import { createContext, FC, ReactNode, useMemo } from 'react';



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
    const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);

    const contextValues: IModalContext = useMemo(() => ({
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
        toggleModal: toggleIsOpen,
    }), [isOpen, setIsOpen, toggleIsOpen]);

    return (
        <ModalContext.Provider value={contextValues}>
            <ChildrenOrFunction 
                childrenOrFunction={children} 
                args={contextValues}
            />
        </ModalContext.Provider>
    );
};