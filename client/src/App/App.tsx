import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';



const socket = io('ws://localhost:5000');

export const App = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        socket.on('chat message', (message: string) => {
            console.log('got message');
            setMessages(prevState => [...prevState, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    async function handleSendMessage() {
        try {
            const response = await fetch('http://localhost:5000/some/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({message}),
            });
            // const messageres = await response.json();
            // console.log(messageres);
            // setMessages(prevState => [...prevState, messageres.message]);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <input 
                type='text' 
                value={message} 
                onChange={(e) => setMessage(e.currentTarget.value)}
            />
            <button onClick={handleSendMessage}>
                button
            </button>

            <ul>
                {
                    messages.map((message, index) => {
                        return (
                            <li key={index}>
                                {message}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
};