import { FC } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';
import { Loaded } from '../components';
import { NavigateToRoom, OnlyUnauthorizedRoute, ProtectedRoute } from './components';

import AppPage from '@pages/AppPage';
import AuthPage from '@pages/AuthPage';
import ChannelPage from '@pages/ChannelPage';
import PrivateChatPage from '@pages/PrivateChatPage';
import InvitationPage from '@pages/InvitationPage';




// const AppPage = lazy(() => import('@pages/AppPage'));
// const AuthPage = lazy(() => import('@pages/AuthPage'));
// const PrivateChatPage = lazy(() => import('@pages/PrivateChatPage'));
// const ChannelPage = lazy(() => import('@pages/ChannelPage'));

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route /*element={<ProtectedRoute/>}*/>
                    <Route element={
                        <>
                            <Loaded/>

                            <Outlet/>
                        </>
                    } /* element={<SuspenseWithLoader/>} */>
                        <Route element={<OnlyUnauthorizedRoute/>}>
                            <Route
                                path='auth'
                                element={<AuthPage/>}
                            />
                        </Route>

                        <Route element={<ProtectedRoute/>}>
                            <Route
                                path='app'
                                element={<WithChannelsNavigation/>}
                            >
                                <Route element={<WithPrivateChatList/>}>
                                    <Route index element={<AppPage/>}/>

                                    <Route
                                        path='private-chat/:privateChatId'
                                        element={<PrivateChatPage/>}
                                    />
                                </Route>

                                <Route
                                    path='channel/:channelId'
                                    element={<WithRoomList/>}
                                >
                                    <Route
                                        index
                                        element={<NavigateToRoom/>}
                                    />

                                    <Route
                                        path='room/:roomId'
                                        element={<ChannelPage/>}
                                    />
                                </Route>

                                <Route
                                    path='*'
                                    element={<Navigate to={'/app'} replace/>}
                                />
                            </Route>
                        </Route>

                        <Route
                            path='invitation/:invitationLink'
                            element={<InvitationPage/>}
                        />
                    </Route>
                </Route>

                {/* <Route path='account-activation/:activationLink' element={<>activation page</>}/> */}

                <Route path='*' element={<Navigate to={'/app'} replace/>}/>
            </Routes>
        </BrowserRouter>
    );
};