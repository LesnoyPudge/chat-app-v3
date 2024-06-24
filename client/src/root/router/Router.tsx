import { FC, PropsWithChildren, Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';
import { GetParam, NavigateToRoom, OnlyAuthorizedRoute, OnlyUnauthorizedRoute } from './components';
import { GlobalLoader } from '../components';
import { isDev, noop } from '@utils';
import { ErrorPage } from '@pages/ErrorPage';
import { GlobalLoaderPage } from '@pages/GlobalLoaderPage';
import { EntityContextProvider, ToDo } from '@components';
import { navigatorPath } from '@hooks';
import { Playground } from '../playground';




const lazyWithDevDelay = (
    cb: Parameters<typeof lazy>[number],
    delay: number,
): ReturnType<typeof lazy> => {
    return lazy(async() => {
        if (isDev()) {
            await new Promise((res) => setTimeout(() => {
                res('');
            }, delay));
        }

        return cb();
    });
};

const AuthPage = lazyWithDevDelay(() => import('@pages/AuthPage'), 300);
const InvitationPage = lazyWithDevDelay(() => import('@pages/InvitationPage'), 300);
const AppSubPage = lazyWithDevDelay(() => import('@subPages/AppSubPage'), 300);
const RoomSubPage = lazyWithDevDelay(() => import('@subPages/RoomSubPage'), 300);
const PrivateChatSubPage = lazyWithDevDelay(() => import('@subPages/PrivateChatSubPage'), 300);
const NoRoomsSubPage = lazyWithDevDelay(() => import('@subPages/NoRoomsSubPage'), 300);

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

export const Router: FC<PropsWithChildren> = ({children}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={(
                    <>
                        {children}

                        <Outlet/>
                    </>
                )}>
                    <If condition={isDev()}>
                        <Route path='dev'>
                            <Route
                                path='loader'
                                element={(
                                    <GlobalLoader.LoadedUnauthorized>
                                        <GlobalLoaderPage/>
                                    </GlobalLoader.LoadedUnauthorized>
                                )}
                            />

                            <Route
                                path='error'
                                element={(
                                    <GlobalLoader.LoadedUnauthorized>
                                        <ErrorPage onReload={noop}/>
                                    </GlobalLoader.LoadedUnauthorized>
                                )}
                            />

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

                            <Route 
                                path='invitation/:invitationLink'
                                element={(
                                    <Suspense fallback={<GlobalLoader.Reset/>}>
                                        <GlobalLoader.LoadedUnauthorized>
                                            <InvitationPage/>
                                        </GlobalLoader.LoadedUnauthorized>
                                    </Suspense>
                                )}
                            />

                            <Route
                                path='playground'
                                element={(
                                    <GlobalLoader.LoadedUnauthorized>
                                        <Playground/>
                                    </GlobalLoader.LoadedUnauthorized>
                                )}
                            />
                        </Route>
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
};