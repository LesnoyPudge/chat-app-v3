import { log, socket, SocketType } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { IChannel, ITextRoom, IUser } from '@backendTypes';
import { useAppDispatch } from '@hooks';
import { addChannel, addTextRoom, addUser } from '@redux/features';



export const useSocket = () => {
    const socketRef = useRef<SocketType | null>(null);
    const dispatch = useAppDispatch();
    const [connected, setConnected] = useState(socket.socketEntity.connected);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socket.socketEntity;
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

        socket.on('sendTextRoomSubscription', (textRoom: ITextRoom) => {
            dispatch(addTextRoom(textRoom));
            log('got subscription update: ', textRoom);
        });

    }, [dispatch]);

    return {
        connected,
    };
};