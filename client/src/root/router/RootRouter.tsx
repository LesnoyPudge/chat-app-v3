import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { WithChannelsNavigation, WithPrivateChatList, WithRoomList } from '@layouts';



const AppPage = lazy(() => import('@pages/AppPage'));
const AuthPage = lazy(() => import('@pages/AuthPage'));
const PrivateChatPage = lazy(() => import('@pages/PrivateChatPage'));
const ChannelPage = lazy(() => import('@pages/ChannelPage'));

export const RootRouter: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route element={<AuthLoader/>}> */}
                <Route 
                    path='auth' 
                    element={
                        <Suspense fallback={<>loading auth page...</>}>
                            <AuthPage/>
                        </Suspense>
                    }
                />

                <Route 
                    path='app' 
                    element={<WithChannelsNavigation/>}
                >
                    <Route element={<WithPrivateChatList/>}>
                        <Route index element={
                            <Suspense fallback={<>loading AppPage...</>}>
                                <AppPage/>
                            </Suspense>
                        }/>

                        <Route 
                            path='private-chat/:privateChatId' 
                            element={
                                <Suspense fallback={<>loading PrivateChatPage...</>}>
                                    <PrivateChatPage/>
                                </Suspense>
                            }
                        />
                    </Route>

                    <Route 
                        path='channel/:channelId/room/:roomId' 
                        element={<WithRoomList/>}
                    >
                        <Route index element={
                            <Suspense fallback={<>loading ChannelPage...</>}>
                                <ChannelPage/>
                            </Suspense>
                        }/>
                    </Route>

                    <Route 
                        path='*' 
                        element={<Navigate to={'app'}/>}
                    />
                </Route>

                {/* <Route path='app'>
                    <Route index element={
                        <Suspense fallback={<>loading AppPage...</>}>
                            <AppPage/>
                        </Suspense>
                    }/>

                    <Route path='private-chat/:privateChatId' element={
                        <Suspense fallback={<>loading PrivateChatPage...</>}>
                            <PrivateChatPage/>
                        </Suspense>
                    }/>

                    <Route path='channel/:channelId/room/:roomId' element={
                        <Suspense fallback={<>loading ChannelPage...</>}>
                            <ChannelPage/>
                        </Suspense>
                    }/>

                    <Route path='*' element={<Navigate to={'app'}/>}/>
                </Route> */}

                {/* <Route >
                    <Route path='app'>
                        <Route index element={
                            <SplitedPageLayout 
                                nav={<><AppPageHeader/>

                                    <PrivateChatList/></>}
                                content={
                                    <Suspense fallback={<>loading friends page...</>}>
                                        <FriendsPage/>
                                    </Suspense>
                                }
                            />
                        }/>
                            
                        <Route path='private-chat/:privateChatId' element={
                            <SplitedPageLayout 
                                nav={<><AppPageHeader/>

                                    <PrivateChatList/></>}
                                content={
                                    <Suspense fallback={<>loading private chat page page...</>}>
                                        <PrivateChatPage/>
                                    </Suspense>
                                }
                            />
                        }/>

                        <Route path='channel/:channelId/room/:roomId' element={
                            <SplitedPageLayout 
                                nav={<>ChannelPage navigation</>}
                                content={
                                    <Suspense fallback={<>loading channel/room page...</>}>
                                        <ChannelPage/>
                                    </Suspense>
                                }
                            />
                            
                        }/>
                    </Route>

                    <Route path='*' element={<Navigate to={'app'}/>}/>
                </Route> */}

                {/* <Route element={
                    <Suspense fallback={<>loading...</>}>
                        <AppLayout/>
                    </Suspense>
                }>
                    <Route path='app'>
                        <Route element={
                            <Suspense fallback={<>loading app page...</>}>
                                <AppPage/>
                            </Suspense>
                        }>
                            <Route index element={
                                <Suspense fallback={<>loading friends page...</>}>
                                    <FriendsPage/>
                                </Suspense>
                            }/>
                            
                            <Route path='private-chat/:privateChatId' element={
                                <Suspense fallback={<>loading private chat page page...</>}>
                                    <PrivateChatPage/>
                                </Suspense>
                            }/>
                        </Route>

                        <Route path='channel/:channelId/room/:roomId' element={
                            <Suspense fallback={<>loading channel/room page...</>}>
                                <ChannelPage/>
                            </Suspense>
                        }/>
                    </Route>

                    <Route path='*' element={<Navigate to={'app'}/>}/>
                </Route> */}

                <Route path='invitation/:invitationLink' element={<>invitation page</>}/>
            
                <Route path='account-activation/:activationLink' element={<>activation page</>}/>
            
                <Route path='*' element={<Navigate to={'/app'} replace />}/>
                {/* </Route> */}
                {/* </Route> */}
            </Routes>
        </BrowserRouter>
    );
};