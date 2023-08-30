import { FC } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';
import { NavigateToRoom, OnlyAuthorizedRoute, OnlyUnauthorizedRoute } from './components';

import AppPage from '@pages/AppPage';
import AuthPage from '@pages/AuthPage';
import ChannelPage from '@pages/ChannelPage';
import PrivateChatPage from '@pages/PrivateChatPage';
import InvitationPage from '@pages/InvitationPage';




// const AppPage = lazy(() => import('@pages/AppPage'));
// const AuthPage = lazy(() => import('@pages/AuthPage'));
// const PrivateChatPage = lazy(() => import('@pages/PrivateChatPage'));
// const ChannelPage = lazy(() => import('@pages/ChannelPage'));


const Loaded: FC = () => {
    return (
        <>
            <Outlet/>
        </>
    );
};

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<OnlyUnauthorizedRoute/>}>
                    <Route element={<Loaded/>}>
                        <Route
                            path='auth'
                            element={<AuthPage/>}
                        />
                    </Route>
                </Route>

                <Route element={<OnlyAuthorizedRoute/>}>
                    <Route
                        path='app'
                        element={<WithChannelsNavigation/>}
                    >
                        <Route element={<Loaded/>}>
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
                </Route>

                <Route path='invitation/:invitationLink'>
                    <Route element={<Loaded/>}>
                        <Route element={<InvitationPage/>}/>
                    </Route>
                </Route>

                <Route path='account-activation/:activationLink' element={<>activation page</>}/>

                <Route path='*' element={<Navigate to={'/app'} replace/>}/>
            </Routes>
        </BrowserRouter>
    );
};