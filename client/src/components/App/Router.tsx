import { FC } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import { selectUser, useUserRefreshQuery } from 'src/redux/features';
import { AppScreen, AuthScreen } from '../screens';



interface IProtectedRoutes {
    children?: React.ReactElement
}

interface IAuthLoader {
    children?: React.ReactElement
}

const AuthLoader: FC<IAuthLoader> = ({ children }) => {
    console.log('auth loader');
    const { isLoading } = useUserRefreshQuery();
    const user = useAppSelector(selectUser);
    console.log(isLoading);
    const location = useLocation();
    const onlyUnauthPaths = ['/auth'];

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

const ProtectedRoutes: FC<IProtectedRoutes> = ({ children }) => {
    const user = useAppSelector(selectUser);
    const location = useLocation();

    if (!user.isAuth) {
        console.log('forbidden');
        return <Navigate to={'/auth'} state={{ from: location }} replace />;
        // navigate('/auth', { state: { from: location }, replace: true });
    }
    
    return children ? children : <Outlet />;
};


export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLoader/>}>
                    <Route path='auth' element={<AuthScreen/>}/>

                    <Route element={<ProtectedRoutes/>}>
                        <Route path='app' element={<AppScreen/>}>
                            <Route index element={<>friend page</>}/>

                            <Route path='private-chat/:targetId' element={<>private chat page</>}/>

                            <Route path='channel/:channelId' element={<>channel page</>}>
                                <Route path='room/:roomId' element={<>roomPage</>}/>
                            </Route>

                            <Route path='*' element={<Navigate to={'.'}/>}/>
                        </Route>

                        <Route path='invitation/:invitationLink' element={<>invitation page</>}/>
            
                        <Route path='account-activation/:activationLink' element={<>activation page</>}/>
            
                        <Route path='*' element={<Navigate to={'/app'} replace />}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};