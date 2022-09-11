import { setTitle } from '@utils';
import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';



const AppLayout = lazy(() => import('@layouts/AppLayout'));
const AppPage = lazy(() => import('@pages/AppPage'));
const AuthPage = lazy(() => import('@pages/AuthPage'));

export const RootRouter: FC = () => {
    setTitle('Wow');
    
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route element={<AuthLoader/>}> */}
                <Route path='auth' element={
                    <Suspense fallback={<>loading auth page...</>}>
                        <AuthPage />
                    </Suspense>
                }/>

                {/* <Route element={<ProtectedRoutes/>}> */}
                <Route path='app' element={
                    <Suspense fallback={<>loading...</>}>
                        <AppLayout/>
                    </Suspense>
                }>
                    <Route index element={
                        <Suspense fallback={<>loading app page...</>}>
                            <AppPage />
                        </Suspense>
                    }/>

                    <Route path='private-chat/:privateChannelId' element={<>private chat page</>}/>

                    <Route path='channel/:channelId' element={<>channel page</>}>
                        <Route path='room/:roomId' element={<>roomPage</>}/>
                    </Route>

                    <Route path='*' element={<Navigate to={'.'}/>}/>
                </Route>
                {/* </Route> */}

                <Route path='invitation/:invitationLink' element={<>invitation page</>}/>
            
                <Route path='account-activation/:activationLink' element={<>activation page</>}/>
            
                <Route path='*' element={<Navigate to={'/app'} replace />}/>
                {/* </Route> */}
                {/* </Route> */}
            </Routes>
        </BrowserRouter>
    );
};