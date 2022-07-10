import { FC, useEffect, useState } from 'react';
import { io } from 'socket.io-client';



export const App: FC = () => {
    const socket = io('ws://localhost:5000');
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
        </>
    );
};