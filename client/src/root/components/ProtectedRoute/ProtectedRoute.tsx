import { Conditional } from '@components';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';



export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
    const isAuthorized = true;
    
    useEffect(() => {
        console.log('protectedRoute', isAuthorized);
    }, [isAuthorized]);
    
    return (
        <Conditional isRendered={isAuthorized}>
            {/* <Outlet/> */}
            {children}
        </Conditional>
    );
};