import { startTransition, useCallback, useRef } from 'react';
import { NavigateOptions, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLatest } from '@hooks';



interface Params {
    privateChatId?: string;
    channelId?: string;
    roomId?: string,
}

type CustomNavigateOptions = NavigateOptions & {
    withState?: boolean;
}

const paths = {
    auth: () => '/auth',
    app: () => '/app',
    anyPrivateChat: () => '/app/private-chat',
    privateChat: (privateChatId: string) => `/app/private-chat/${privateChatId}`,
    channel: (channelId: string) => `/app/channel/${channelId}`,
    room: (channelId: string, roomId: string) => `/app/channel/${channelId}/room/${roomId}`,
};

export const useNavigator = () => {
    const navigateInner = useNavigate();
    const params = useParams<Readonly<Params>>();
    const { pathname } = useLocation();
    const latestPathRef = useLatest(pathname);
    const stateRef = useRef({ from: '/app' });
    const latestNavigate = useLatest(navigateInner);

    const navigate = useCallback((to: string, options?: NavigateOptions) => {
        console.log(`Navigate to: ${to}`);

        latestNavigate.current(to, options);
    }, [latestNavigate]);

    const myLocationIsRef = useRef({
        auth: () => latestPathRef.current === paths.auth(),
        app: () => latestPathRef.current === paths.app(),
        anyPrivateChat: () => latestPathRef.current.includes(paths.anyPrivateChat()),
        privateChat: (...args: Parameters<typeof paths.privateChat>) => {
            return latestPathRef.current === paths.privateChat(...args);
        },
        channel: (...args: Parameters<typeof paths.channel>) => {
            return latestPathRef.current.includes(paths.channel(...args));
        },
        room: (...args: Parameters<typeof paths.room>) => {
            return latestPathRef.current === paths.room(...args);
        },
    });

    const navigateToRef = useRef({
        auth: (options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.auth()) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            startTransition(() => navigate(paths.auth(), options));
        },
        app: (options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.app()) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            startTransition(() => navigate(paths.app(), options));
        },
        privateChat: (privateChatId: string, options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.privateChat(privateChatId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            startTransition(() => navigate(paths.privateChat(privateChatId), options));
        },
        channel: (channelId: string, options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.channel(channelId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            startTransition(() => navigate(paths.channel(channelId), options));
        },
        room: (channelId: string, roomId: string, options?: CustomNavigateOptions) => {
            if (myLocationIsRef.current.room(channelId, roomId)) return;

            if (options?.withState) {
                stateRef.current.from = latestPathRef.current;
            }

            startTransition(() => navigate(paths.room(channelId, roomId), options));
        },
    });

    return {
        myLocationIs: myLocationIsRef.current,
        navigateTo: navigateToRef.current,
        params,
        stateRef,
        paths,
        navigate,
    };
};