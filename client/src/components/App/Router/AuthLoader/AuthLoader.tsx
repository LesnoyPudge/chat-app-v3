import { FC, useLayoutEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import { useUserRefreshQuery, selectUser } from 'src/redux/features';
import rootApi from 'src/redux/store/rootApi';
import { socket } from 'src/utils';
import { socketListenersInit } from './socketListenersInit';



interface IAuthLoader {
    children?: React.ReactElement
}

const onlyUnauthPaths = ['/auth'];

export const AuthLoader: FC<IAuthLoader> = ({ children }) => {
    console.log('auth loader');
    const { isLoading } = useUserRefreshQuery();
    const user = useAppSelector(selectUser);
    const location = useLocation();
    const endpoints = rootApi.endpoints as any;
    
    console.log(endpoints.userRefresh);
    useLayoutEffect(() => {
        if (!user.info.id) return;
        socket().emitters.user.joinRooms(user.info.id);
        socketListenersInit();
    }, [user.info.id]);

    if (isLoading) return <>loading</>;
    
    if (user.isAuth && onlyUnauthPaths.includes(location.pathname)) {
        const state = location.state as {
            from?: {
                pathname: string;
            };
        } | null;

        const path = state?.from?.pathname ? state.from.pathname : '/app';
        console.log('got on anti auth route, redirecting to: ', path);

        return <Navigate to={path}/>; 
    }
    
    return children ? children : <Outlet />;
};