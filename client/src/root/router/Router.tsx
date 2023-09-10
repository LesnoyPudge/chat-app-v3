import { FC, Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';
import { GetParam, NavigateToRoom, OnlyAuthorizedRoute, OnlyUnauthorizedRoute } from './components';
import { GlobalLoader } from '../components';
import { getEnv, noop } from '@utils';
import { ErrorPage } from '@pages/ErrorPage';
import { GlobalLoaderPage } from '@pages/GlobalLoaderPage';
import { EntityContextProvider, ToDo } from '@components';
import { navigatorPath } from '@hooks';



const { CUSTOM_NODE_ENV } = getEnv();

const lazyWithDevDelay = (
    cb: Parameters<typeof lazy>[number],
    delay: number,
): ReturnType<typeof lazy> => {
    return lazy(async() => {
        if (CUSTOM_NODE_ENV === 'development') {
            await new Promise((res) => setTimeout(() => {
                res('');
            }, delay));
        }

        return cb();
    });
};

const AuthPage = lazyWithDevDelay(() => import('@pages/AuthPage'), 3000);
const InvitationPage = lazyWithDevDelay(() => import('@pages/AuthPage'), 3000);
const AppSubPage = lazyWithDevDelay(() => import('@subPages/AppSubPage'), 3000);
const RoomSubPage = lazyWithDevDelay(() => import('@subPages/RoomSubPage'), 3000);
const PrivateChatSubPage = lazyWithDevDelay(() => import('@subPages/PrivateChatSubPage'), 3000);
const NoRoomsSubPage = lazyWithDevDelay(() => import('@subPages/NoRoomsSubPage'), 3000);

const SubPageSkeleton: FC = () => {
    return (
        <ToDo text='change SubPageSkeleton to actual skeleton'>
            <>loading...</>
        </ToDo>
    );
};

const RouteNotFound = (
    <Route
        path='*'
        element={<Navigate to={navigatorPath.app()} replace/>}
    />
);

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <If condition={CUSTOM_NODE_ENV === 'development'}>
                    <Route
                        path='loader'
                        element={(
                            <Suspense fallback={<GlobalLoader.Reset/>}>
                                <GlobalLoader.LoadedUnauthorized>
                                    <GlobalLoaderPage/>
                                </GlobalLoader.LoadedUnauthorized>
                            </Suspense>
                        )}
                    />

                    <Route
                        path='error'
                        element={(
                            <Suspense fallback={<GlobalLoader.Reset/>}>
                                <GlobalLoader.LoadedUnauthorized>
                                    <ErrorPage onReload={noop}/>
                                </GlobalLoader.LoadedUnauthorized>
                            </Suspense>
                        )}
                    />
                </If>

                <Route element={<OnlyUnauthorizedRoute/>}>
                    <Route
                        path='auth'
                        element={(
                            <Suspense fallback={<GlobalLoader.Reset/>}>
                                <GlobalLoader.LoadedUnauthorized>
                                    <AuthPage/>
                                </GlobalLoader.LoadedUnauthorized>
                            </Suspense>
                        )}
                    />
                </Route>

                <Route element={<OnlyAuthorizedRoute/>}>
                    <Route path='app'>
                        <Route element={<WithChannelsNavigation/>}>
                            <Route element={<WithPrivateChatList/>}>
                                <Route index element={(
                                    <Suspense fallback={<SubPageSkeleton/>}>
                                        <GlobalLoader.Loaded>
                                            <AppSubPage/>
                                        </GlobalLoader.Loaded>
                                    </Suspense>
                                )}/>

                                <Route path='private-chat/:privateChannelId'>
                                    <Route element={(
                                        <GetParam param='privateChannelId'>
                                            {({ privateChannelId }) => (
                                                <EntityContextProvider.PrivateChannel id={privateChannelId}>
                                                    <Outlet/>
                                                </EntityContextProvider.PrivateChannel>
                                            )}
                                        </GetParam>
                                    )}>
                                        <Route index element={(
                                            <Suspense fallback={<SubPageSkeleton/>}>
                                                <GlobalLoader.Loaded>
                                                    <PrivateChatSubPage/>
                                                </GlobalLoader.Loaded>
                                            </Suspense>
                                        )}/>
                                    </Route>
                                </Route>
                            </Route>

                            <Route path='channel/:channelId'>
                                <Route element={(
                                    <GetParam param='channelId'>
                                        {({ channelId }) => (
                                            <EntityContextProvider.Channel id={channelId}>
                                                <Outlet/>
                                            </EntityContextProvider.Channel>
                                        )}
                                    </GetParam>
                                )}>
                                    <Route element={<WithRoomList/>}>
                                        <Route
                                            index
                                            element={(
                                                <NavigateToRoom
                                                    loader={<>show room skeleton loader while deciding what room to join</>}
                                                    fallback={(
                                                        <Suspense fallback={<>show room skeleton loader while deciding what room to join</>}>
                                                            <GlobalLoader.Loaded>
                                                                <NoRoomsSubPage/>
                                                            </GlobalLoader.Loaded>
                                                        </Suspense>
                                                    )}
                                                />
                                            )}
                                        />

                                        <Route path='room/:roomId'>
                                            <Route element={(
                                                <GetParam param='roomId'>
                                                    {({ roomId }) => (
                                                        <EntityContextProvider.Room id={roomId}>
                                                            <Outlet/>
                                                        </EntityContextProvider.Room>
                                                    )}
                                                </GetParam>
                                            )}>
                                                <Route index element={(
                                                    <Suspense fallback={<SubPageSkeleton/>}>
                                                        <GlobalLoader.Loaded>
                                                            <RoomSubPage/>
                                                        </GlobalLoader.Loaded>
                                                    </Suspense>
                                                )}/>
                                            </Route>
                                        </Route>
                                    </Route>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>

                <Route path='invitation/:invitationLink'>
                    <Route index element={(
                        <Suspense fallback={<GlobalLoader.Reset/>}>
                            <GlobalLoader.Loaded>
                                <InvitationPage/>
                            </GlobalLoader.Loaded>
                        </Suspense>
                    )}/>
                </Route>

                {RouteNotFound}
            </Routes>
        </BrowserRouter>
    );
};