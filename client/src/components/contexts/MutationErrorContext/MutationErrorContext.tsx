import { SerializedError } from '@reduxjs/toolkit';
import { CustomQueryError } from '@types';
import { FC, PropsWithChildren, createContext } from 'react';



type Error = CustomQueryError | SerializedError | undefined

type MutationErrorContextProvider = PropsWithChildren & {
    error: Error;
}

export const MutationErrorContext = createContext<Error>();

export const MutationErrorContextProvider: FC<MutationErrorContextProvider> = ({
    error,
    children,
}) => {
    return (
        <MutationErrorContext.Provider value={error}>
            {children}
        </MutationErrorContext.Provider>
    );
};