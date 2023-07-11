import { AppSelectors } from '@redux/features';
import { useAppSelector } from '@redux/hooks';
import { useEffect, useRef } from 'react';
import { socketIO } from '@root/features';
import { SocketAuth } from '@shared';
import { localStorageApi } from '@utils';



export const useSocketStateHandler = () => {
    const socketRef = useRef(socketIO);
    const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);

    useEffect(() => {
        const socket = socketRef.current;
        const accessToken = localStorageApi.get('accessToken');

        if (accessToken && isAuthorized) {
            socket.auth = {
                accessToken,
            } satisfies SocketAuth;

            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, [isAuthorized]);
};