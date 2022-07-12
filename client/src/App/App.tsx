import { FC, useEffect, useState } from 'react';
import { io } from 'socket.io-client';



export const App: FC = () => {
    const socket = io('ws://localhost:5000');
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    const qwe = async() => {
        fetch('http://localhost:5000/api/v1/user/create', {
            method: 'POST',
            
        });
    };
    qwe();

    return (
        <>
        </>
    );
};