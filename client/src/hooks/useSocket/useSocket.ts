import { socket } from '@socket';
import { getEnv, getLocalStorage, log } from '@utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IChannel, IUser } from '@backendTypes';
import { useAppDispatch } from '../useAppDispatch';
import { addChannel, reciveSubscription } from '@redux/features';



export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useAppDispatch();
    const [connected, setConnected] = useState(socket.connected);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socket;
        }
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;
        const socket = socketRef.current;
        
        socket.on('connect', () => {
            log('connected');
            setConnected(socket.connected);
            
        });
        
        socket.on('disconnect', () => {
            log('disconnect');
            setConnected(socket.connected);
        });
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;
        const socket = socketRef.current;
        log('listeners initialized');

        socket.on('connect_error', (error: {message?: string, data?: string, name?: string}) => {
            log('socket error:', {
                message: error.message,
                status: error.data,
                name: error.name,
            });
        });
      
        socket.on('sendSubscriptionUpdate', (user: IUser) => {
            log('got in listener');
            dispatch(reciveSubscription(user));
            log('got subscription update: ', user);
        });
            
        socket.on('getSubscription', (user: IUser) => {
            log('got in listener');
            dispatch(reciveSubscription(user));
            log('subscribed and get data: ', user);
        });

        socket.on('sendSubscriptionUpdateFromChannel', (channel: IChannel) => {
            log('got in listener');
            dispatch(addChannel(channel));
            log('got subscription update: ', channel);
        });
        
        socket.on('getSubscriptionFromChannel', (channel: IChannel) => {
            log('got in listener');
            dispatch(addChannel(channel));
            log('subscribed and get data: ', channel);
        });
    }, [dispatch]);

    return {
        connected,
    };
};