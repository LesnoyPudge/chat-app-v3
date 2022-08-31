import { log, socket, SocketType } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { IChannel, IMessage, IPrivateChannel, IRoom, IUser } from '@backendTypes';
import { useAppDispatch } from '@hooks';
import { addChannel, addMessage, addPrivateChannel, addRoom, addUser, removeChannel, removeRoom } from '@redux/features';



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
            log('got user sub update: ', user);
        });

        socket.on('sendChannelSubscription', (channel: IChannel) => {
            dispatch(addChannel(channel));
            log('got channel sub update: ', channel);
        });

        socket.on('sendRoomSubscription', (room: IRoom) => {
            dispatch(addRoom(room));
            log('got room sub update: ', room);
        });

        socket.on('sendMessageSubscription', (message: IMessage) => {
            dispatch(addMessage(message));
            log('got message sub update:', message);
        });
        
        socket.on('sendPrivateChannelSubscription', (privateChannel: IPrivateChannel) => {
            dispatch(addPrivateChannel(privateChannel));
            log('got private channel sub update:', privateChannel);
        });

        socket.on('removeChannelSubscription', (channelId: string) => {
            dispatch(removeChannel(channelId));
            log('channel removed:', channelId);
        });

        socket.on('removeRoomSubscription', (roomId: string) => {
            dispatch(removeRoom(roomId));
            log('room removed:', roomId);
        });
    }, [dispatch]);

    return {
        connected,
    };
};