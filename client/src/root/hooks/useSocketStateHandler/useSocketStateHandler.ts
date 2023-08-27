import { AppSelectors } from '@redux/features';
import { useMemoSelector } from '@redux/hooks';
import { useEffect, useRef } from 'react';
import { socketIO } from '@root/features';
import { SocketAuth } from '@shared';
import { localStorageApi } from '@utils';



export const useSocketStateHandler = () => {
    const isAuthorized = useMemoSelector(AppSelectors.selectIsAuthorized);

    useEffect(() => {
        const accessToken = localStorageApi.get('accessToken');

        if (accessToken && isAuthorized) {
            socketIO.auth = {
                accessToken,
            } satisfies SocketAuth;

            socketIO.connect();
        }

        return () => {
            // socketIO.disconnect();
        };
    }, [isAuthorized]);
};