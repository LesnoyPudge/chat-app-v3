import { socket } from '@socket';
import { getEnv, getLocalStorage, log } from '@utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IChannel, IUser } from '@backendTypes';
import { useAppDispatch } from '../useAppDispatch';
import { addChannel, addUser } from '@redux/features';



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
      
        socket.on('sendUserSubscription', (user: IUser) => {
            dispatch(addUser(user));
            log('got subscription update: ', user);
        });

        socket.on('sendChannelSubscription', (channel: IChannel) => {
            dispatch(addChannel(channel));
            log('got subscription update: ', channel);
        });

    }, [dispatch]);

    return {
        connected,
    };
};