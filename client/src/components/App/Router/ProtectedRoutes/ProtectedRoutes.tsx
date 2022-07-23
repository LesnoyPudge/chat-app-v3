import { FC } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import { selectUser } from 'src/redux/features';




interface IProtectedRoutes {
    children?: React.ReactElement
}

export const ProtectedRoutes: FC<IProtectedRoutes> = ({ children }) => {
    const user = useAppSelector(selectUser);
    const location = useLocation();

    if (!user.isAuth) {
        console.log('forbidden');
        return <Navigate to={'/auth'} state={{ from: location }} replace />;
    }
    
    return children ? children : <Outlet />;
};