import { useCallback, useRef } from 'react';
import { NavigateOptions, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLatest } from '@hooks';
import { localStorageApi } from '@utils';



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

    const navigate = useCallback((to: string, options?: NavigateOptions) => {
        console.log(`Navigate to: ${to}`);

        navigateInner(to, options);
    }, [navigateInner]);

    const myLocationIsRef = useRef({
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
    });

    const navigateToRef = useRef({
        auth: (options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.auth()) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.auth(), options);
        },
        app: (options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.app()) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.app(), options);
        },
        privateChat: (privateChatId: string, options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.privateChat(privateChatId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.privateChat(privateChatId), options);
        },
        channel: (channelId: string, options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.channel(channelId)) return;

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
            if (myLocationIsRef.current.room(channelId, roomId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            navigate(navigatorPath.room(channelId, roomId), options);
        },
    });

    return {
        myLocationIs: myLocationIsRef.current,
        navigateTo: navigateToRef.current,
        params,
        stateRef,
        navigatorPath,
        navigate,
    };
};