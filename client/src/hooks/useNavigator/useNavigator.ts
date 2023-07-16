import { useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLatest } from '@hooks';



interface Params {
    privateChatId?: string;
    channelId?: string;
    roomId?: string,
}

export const useNavigator = () => {
    const navigate = useNavigate();
    const params = useParams() as Params;
    const { pathname } = useLocation();
    const latestPathRef = useLatest(pathname);

    const myLocationIsRef = useRef({
        auth: () => latestPathRef.current === '/auth',
        app: () => latestPathRef.current === '/app',
        anyPrivateChat: () => latestPathRef.current.includes('/app/private-chat'),
        privateChat: (privateChatId: string) => {
            return latestPathRef.current === `/app/private-chat/${privateChatId}`;
        },
        channel: (channelId: string) => {
            return latestPathRef.current.includes(`/app/channel/${channelId}`);
        },
        room: (channelId: string, roomId: string) => {
            return latestPathRef.current === `/app/channel/${channelId}/room/${roomId}`;
        },
    });

    const navigateToRef = useRef({
        auth: () => {
            const alreadyHere = myLocationIsRef.current.auth();
            !alreadyHere && navigate('/auth');
        },
        app: () => {
            const alreadyHere = myLocationIsRef.current.app();
            !alreadyHere && navigate('/app');
        },
        privateChat: (privateChatId: string) => {
            const alreadyHere = myLocationIsRef.current.privateChat(privateChatId);
            !alreadyHere && navigate(`/app/private-chat/${privateChatId}`);
        },
        channel: (channelId: string) => {
            const alreadyHere = myLocationIsRef.current.channel(channelId);
            !alreadyHere && navigate(`/app/channel/${channelId}`);
        },
        room: (channelId: string, roomId: string) => {
            const alreadyHere = myLocationIsRef.current.room(channelId, roomId);
            !alreadyHere && navigate(`/app/channel/${channelId}/room/${roomId}`);
        },
    });

    return {
        myLocationIs: myLocationIsRef.current,
        navigateTo: navigateToRef.current,
        params,
    };
};