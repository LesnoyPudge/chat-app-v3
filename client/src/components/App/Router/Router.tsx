import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppScreen, AuthScreen } from '../../screens';
import { AuthLoader } from './AuthLoader';
import { ProtectedRoutes } from './ProtectedRoutes';



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