import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';
import { NavigateToRoom, OnlyAuthorizedRoute, OnlyUnauthorizedRoute } from './components';

import AppPage from '@pages/AppPage';
import AuthPage from '@pages/AuthPage';
import ChannelPage from '@pages/ChannelPage';
import PrivateChatPage from '@pages/PrivateChatPage';
import InvitationPage from '@pages/InvitationPage';
import { GlobalLoader } from '../components';
import { getEnv, noop } from '@utils';
import { ErrorPage } from '@pages/ErrorPage';
import { GlobalLoaderPage } from '@pages/GlobalLoaderPage';




// const AppPage = lazy(() => import('@pages/AppPage'));
// const AuthPage = lazy(() => import('@pages/AuthPage'));
// const PrivateChatPage = lazy(() => import('@pages/PrivateChatPage'));
// const ChannelPage = lazy(() => import('@pages/ChannelPage'));

const { CUSTOM_NODE_ENV } = getEnv();

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <If condition={CUSTOM_NODE_ENV === 'development'}>
                    <Route
                        path='loader'
                        element={(
                            <GlobalLoader.LoadedForced>
                                <GlobalLoaderPage/>
                            </GlobalLoader.LoadedForced>
                        )}
                    />

                    <Route
                        path='error'
                        element={(
                            <GlobalLoader.LoadedForced>
                                <ErrorPage onReload={noop}/>
                            </GlobalLoader.LoadedForced>
                        )}
                    />
                </If>

                <Route element={<OnlyUnauthorizedRoute/>}>
                    <Route
                        path='auth'
                        element={(
                            <GlobalLoader.Loaded>
                                <AuthPage/>
                            </GlobalLoader.Loaded>
                        )}
                    />
                </Route>

                <Route element={<OnlyAuthorizedRoute/>}>
                    <Route
                        path='app'
                        element={<WithChannelsNavigation/>}
                    >
                        <Route element={<WithPrivateChatList/>}>
                            <Route index element={(
                                <GlobalLoader.Loaded>
                                    <AppPage/>
                                </GlobalLoader.Loaded>
                            )}/>

                            <Route
                                path='private-chat/:privateChatId'
                                element={(
                                    <GlobalLoader.Loaded>
                                        <PrivateChatPage/>
                                    </GlobalLoader.Loaded>
                                )}
                            />
                        </Route>

                        <Route
                            path='channel/:channelId'
                            element={<WithRoomList/>}
                        >
                            <Route
                                index
                                element={(
                                    <GlobalLoader.Loaded>
                                        <NavigateToRoom/>
                                    </GlobalLoader.Loaded>
                                )}
                            />

                            <Route
                                path='room/:roomId'
                                element={(
                                    <GlobalLoader.Loaded>
                                        <ChannelPage/>
                                    </GlobalLoader.Loaded>
                                )}
                            />
                        </Route>

                        <Route
                            path='*'
                            element={<Navigate to={'/app'} replace/>}
                        />
                    </Route>
                </Route>

                <Route path='invitation/:invitationLink' element={(
                    <GlobalLoader.Loaded>
                        <InvitationPage/>
                    </GlobalLoader.Loaded>
                )}/>

                <Route path='account-activation/:activationLink' element={(
                    <GlobalLoader.Loaded>
                        <>activation page</>
                    </GlobalLoader.Loaded>
                )}/>

                <Route path='*' element={<Navigate to={'/app'} replace/>}/>
            </Routes>
        </BrowserRouter>
    );
};