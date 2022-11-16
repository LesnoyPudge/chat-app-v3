import { FC, PropsWithChildren, Suspense } from 'react';
import { Loaded } from '../Loaded';



export const SuspenseWithLoader: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Suspense>
            {children}

            <Loaded/>
        </Suspense>
    );
};