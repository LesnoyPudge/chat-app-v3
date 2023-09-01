import { FC, PropsWithChildren, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';
import { NavigateToRoom, OnlyAuthorizedRoute, OnlyUnauthorizedRoute } from './components';
import { GlobalLoader } from '../components';
import { getEnv, noop } from '@utils';
import { ErrorPage } from '@pages/ErrorPage';
import { GlobalLoaderPage } from '@pages/GlobalLoaderPage';
import { ToDo } from '@components';



const AuthPage = lazy(() => import('@pages/AuthPage'));
const InvitationPage = lazy(() => import('@pages/AuthPage'));
const AppSubPage = lazy(() => import('@subPages/AppSubPage'));
const ChannelSubPage = lazy(() => import('@subPages/ChannelSubPage'));
const PrivateChatSubPage = lazy(() => import('@subPages/PrivateChatSubPage'));

const { CUSTOM_NODE_ENV } = getEnv();

const SubPageSkeleton: FC = () => {
    console.log('in sub page skeleton');

    useEffect(() => {
        console.log('subPageSkeleton');
    }, []);

    return (
        // <ToDo text='change SubPageSkeleton to actual skeleton'>
        <>loading...</>
        // </ToDo>
    );
};

const Wr: FC<PropsWithChildren> = ({ children }) => {
    console.log('in sus fallback');
    return (
        <>
            {children}
        </>
    );
};

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
                    <Route
                        path='app'
                        element={<WithChannelsNavigation/>}
                    >
                        <Route element={<WithPrivateChatList/>}>
                            <Route index element={(
                                <Suspense fallback={<SubPageSkeleton/>}>
                                    <GlobalLoader.Loaded>
                                        <AppSubPage/>
                                    </GlobalLoader.Loaded>
                                </Suspense>
                            )}/>

                            <Route
                                path='private-chat/:privateChatId'
                                element={(
                                    <Suspense fallback={<SubPageSkeleton/>}>
                                        <GlobalLoader.Loaded>
                                            <PrivateChatSubPage/>
                                        </GlobalLoader.Loaded>
                                    </Suspense>
                                )}
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
                                element={(
                                    <Suspense fallback={<SubPageSkeleton/>}>
                                        <GlobalLoader.Loaded>
                                            <ChannelSubPage/>
                                        </GlobalLoader.Loaded>
                                    </Suspense>
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
                    <Suspense fallback={<GlobalLoader.Reset/>}>
                        <GlobalLoader.Loaded>
                            <InvitationPage/>
                        </GlobalLoader.Loaded>
                    </Suspense>
                )}/>

                <Route path='*' element={<Navigate to={'/app'} replace/>}/>
            </Routes>
        </BrowserRouter>
    );
};