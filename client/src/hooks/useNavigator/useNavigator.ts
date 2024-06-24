import { useCallback, useRef } from 'react';
import { NavigateOptions, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLatest } from '@hooks';
import { localStorageApi } from '@utils';
import { useAppDispatch } from '@redux/hooks';
import { AppSlice } from '@redux/features';
import { useConst } from '@lesnoypudge/utils-react';



export type Params = {
    privateChannelId?: string;
    channelId?: string;
    roomId?: string,
    invitationLink?: string;
}

type CustomNavigateOptions = NavigateOptions & {
    withState?: boolean;
}

export const navigatorPath = {
    auth: () => '/auth',
    app: () => '/app',
    anyPrivateChat: () => '/app/private-chat',
    privateChat: (privateChatId: string) => `/app/private-chat/${privateChatId}`,
    channel: (channelId: string) => `/app/channel/${channelId}`,
    room: (channelId: string, roomId: string) => `/app/channel/${channelId}/room/${roomId}`,
};

export const useNavigator = () => {
    const navigateInner = useNavigate();
    const params = useParams<Params>();
    const { pathname } = useLocation();
    const latestPathRef = useLatest(pathname);
    const stateRef = useRef({ from: navigatorPath.app() });
    const {dispatch} = useAppDispatch()
    
    const closeMobileMenu = () => {
        dispatch(AppSlice.actions.setMobileMenuState(false))
    }

    const navigate = useCallback((to: string, options?: NavigateOptions) => {
        console.log(`Navigate to: ${to}`);

        navigateInner(to, options);
    }, [navigateInner]);

    const myLocationIs = useConst(() => ({
        auth: () => latestPathRef.current === navigatorPath.auth(),
        app: () => latestPathRef.current === navigatorPath.app(),
        anyPrivateChat: () => latestPathRef.current.includes(navigatorPath.anyPrivateChat()),
        privateChat: (...args: Parameters<typeof navigatorPath.privateChat>) => {
            return latestPathRef.current === navigatorPath.privateChat(...args);
        },
        channel: (...args: Parameters<typeof navigatorPath.channel>) => {
            return latestPathRef.current.includes(navigatorPath.channel(...args));
        },
        room: (...args: Parameters<typeof navigatorPath.room>) => {
            return latestPathRef.current === navigatorPath.room(...args);
        },
    }));

    const navigateTo = useConst(() => ({
        auth: (options?: CustomNavigateOptions) => {
            if (myLocationIs.auth()) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.auth(), options);
        },
        app: (options?: CustomNavigateOptions) => {
            closeMobileMenu()
            
            if (myLocationIs.app()) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.app(), options);
        },
        privateChat: (privateChatId: string, options?: CustomNavigateOptions) => {
            closeMobileMenu()

            if (myLocationIs.privateChat(privateChatId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.privateChat(privateChatId), options);
        },
        channel: (channelId: string, options?: CustomNavigateOptions) => {
            closeMobileMenu()

            if (myLocationIs.channel(channelId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            const latestRoomId = localStorageApi.get('lastVisitedTextRooms')?.[channelId];
            if (latestRoomId) {
                navigate(navigatorPath.room(channelId, latestRoomId), options);
                return;
            }

            navigate(navigatorPath.channel(channelId), options);
        },
        room: (channelId: string, roomId: string, options?: CustomNavigateOptions) => {
            closeMobileMenu()

            if (myLocationIs.room(channelId, roomId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.room(channelId, roomId), options);
        },
    }));

    const navigateToDev = useConst(() => ({
        app: () => navigate('app'),
        loader: () => navigate('/dev/loader'),
        error: () => navigate('/dev/error'),
        auth: () => navigate('/dev/auth'),
        playground: () => navigate('/dev/playground'),
        invitation: () => navigate('/dev/invitation/fake-link'),
    }))

    return {
        myLocationIs,
        navigateTo,
        params,
        stateRef,
        navigatorPath,
        navigate,
        navigateToDev,
    };
};