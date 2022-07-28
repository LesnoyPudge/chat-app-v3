import { FC, useLayoutEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@hooks';
import { useUserRefreshQuery, selectUser } from '@redux';
import { socket } from '@socket';
import { socketListenersInit } from './socketListenersInit';
import { log } from '@utils';



interface IAuthLoader {
    children?: React.ReactElement
}

const onlyUnauthPaths = ['/auth'];

export const AuthLoader: FC<IAuthLoader> = ({ children }) => {
    log('auth loader');
    const { isLoading } = useUserRefreshQuery();
    const user = useAppSelector(selectUser);
    const location = useLocation();

    useLayoutEffect(() => {
        if (!user.info.id) return;
        socket.user.joinRooms({ rooms: user.info.id });
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
        log('got on anti auth route, redirecting to: ', path);

        return <Navigate to={path}/>; 
    }
    
    return children ? children : <Outlet />;
};