import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';



interface Params {
    privateChatId?: string;
    channelId?: string;
    roomId?: string,
}

export const useNavigator = () => {
    const navigate = useNavigate();
    const params = useParams() as Params;
    const { pathname } = useLocation();

    const myLocationIs = useMemo(() => ({
        auth: pathname === '/auth',
        app: pathname === '/app',
        anyPrivateChat: pathname.includes('/app/private-chat'),
        privateChat: (privateChatId: string) => pathname === `/app/private-chat/${privateChatId}`,
        channel: (channelId: string) => pathname.includes(`/app/channel/${channelId}`),
        room: (channelId: string, roomId: string) => pathname.includes(`/app/channel/${channelId}/room/${roomId}`),
    }), [pathname]);

    const navigateTo = useMemo(() => ({
        auth: () => {
            const alreadyHere = myLocationIs.auth;
            !alreadyHere && navigate('/auth');
        },
        app: () => {
            const alreadyHere = myLocationIs.app;
            !alreadyHere && navigate('/app');
        },
        privateChat: (privateChatId: string) => {
            const alreadyHere = myLocationIs.privateChat(privateChatId);
            !alreadyHere && navigate(`/app/private-chat/${privateChatId}`);
        },
        channel: (channelId: string) => {
            const alreadyHere = myLocationIs.channel(channelId);
            !alreadyHere && navigate(`/app/channel/${channelId}`);
        },
        room: (channelId: string, roomId: string) => {
            const alreadyHere = myLocationIs.room(channelId, roomId);
            !alreadyHere && navigate(`/app/channel/${channelId}/room/${roomId}`);
        },
    }), [myLocationIs, navigate]);
    
    return {
        myLocationIs,
        navigateTo,
        params,
    };
};