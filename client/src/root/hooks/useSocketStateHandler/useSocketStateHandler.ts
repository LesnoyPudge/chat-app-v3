import { AppSelectors, AppSlice } from '@redux/features';
import { useAppDispatch, useMemoSelector } from '@redux/hooks';
import { useEffect } from 'react';
import { socketIO } from '@root/features';
import { SocketAuth } from '@shared';
import { cookies } from '@utils';



export const useSocketStateHandler = () => {
    const { dispatch } = useAppDispatch();
    const isAuthorized = useMemoSelector(AppSelectors.selectIsAuthorized);

    useEffect(() => {
        const accessToken = cookies.get('accessToken');

        if (accessToken && isAuthorized) {
            socketIO.auth = {
                accessToken,
            } satisfies SocketAuth;

            socketIO.connect();
        }

        return () => {
            socketIO.disconnect();
        };
    }, [isAuthorized]);

    useEffect(() => {
        socketIO.on('connect', () => {
            dispatch(AppSlice.actions.setIsSocketConnected(true));
        });

        socketIO.on('disconnect', () => {
            dispatch(AppSlice.actions.setIsSocketConnected(true));
        });

        return () => {
            socketIO.off('connect');
            socketIO.off('disconnect');
        };
    }, [dispatch]);
};