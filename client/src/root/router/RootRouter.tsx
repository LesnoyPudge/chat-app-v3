import { setTitle } from '@utils';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



export const RootRouter: FC = () => {
    setTitle('Wow');
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <div>
                        wow
                    </div>
                }/>
                {/* <Route element={<AuthLoader/>}>
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
                </Route> */}
            </Routes>
        </BrowserRouter>
    );
};