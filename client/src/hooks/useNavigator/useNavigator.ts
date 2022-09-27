import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';



interface IParams {
    privateChatId?: string;
    channelId?: string;
    roomId?: string,
}

export const useNavigator = () => {
    const navigate = useNavigate();
    const params = useParams() as IParams;
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
        auth: () => navigate('/auth'),
        app: () => navigate('/app'),
        privateChat: (privateChatId: string) => navigate(`/app/private-chat/${privateChatId}`),
        channel: (channelId: string) => navigate(`/app/channel/${channelId}`),
        room: (channelId: string, roomId: string) => navigate(`/app/channel/${channelId}/room/${roomId}`),
    }), [navigate]);
    
    return {
        myLocationIs,
        navigateTo,
        params,
    };
};