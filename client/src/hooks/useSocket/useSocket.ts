import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { eventEmitters, eventListener } from '../../socket';
import { getEnv } from '../../utils';


 
export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const connect = () => {
        if (socketRef.current) return socketRef.current;
        return socketRef.current = io(getEnv().REACT_APP_WS_SERVER);
    };

    const disconnect = () => {
        if (!socketRef.current) return;
        socketRef.current.disconnect();
    };

    useEffect(() => {
        const socket = connect();

        eventListener(socket);

        socket.on('connect', () => {
            setConnected(socket.connected);
        });

        socket.on('disconnect', () => {
            setConnected(socket.connected);
        });

        return () => {
            disconnect();
        };
    }, []);

    return {
        connected,
        eventEmitter: eventEmitters(connect()),
    };
};