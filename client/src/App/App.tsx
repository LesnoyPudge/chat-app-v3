import { FC, useRef } from 'react';
import { useSocket } from '../hooks';



export const App: FC = () => {
    const { connected, eventEmitter } = useSocket();
    const joinRef = useRef<HTMLInputElement>(null);
    const subscribeRef = useRef<HTMLInputElement>(null);
    const unsubscribeRef = useRef<HTMLInputElement>(null);

    console.log(connected);

    eventEmitter.user.joinRooms(['']);
    eventEmitter.chat.sendMessage('');

    // const qwe = async() => {
    //     fetch('http://localhost:5000/api/v1/user/create', {
    //         method: 'POST',
            
    //     });
    // };
    // qwe();

    return (
        <>
            <div style={{ display: 'grid', width: '300px' }}>
                <input type='text' ref={joinRef}/>
                <button onClick={() => {eventEmitter.user.joinRooms(joinRef.current?.value || '123');}}>
                    joinRoom
                </button>
                
                <input type='text' ref={subscribeRef}/>
                <button onClick={() => {eventEmitter.user.subscribe({
                    targetId: subscribeRef.current?.value || '123', 
                    userId: 'myId',
                });}}>
                    subscribe
                </button>

                <input type='text' ref={unsubscribeRef}/>
                <button onClick={() => {eventEmitter.user.unsubscribe({ 
                    targetId: unsubscribeRef.current?.value || '123', 
                    userId: 'myId', 
                });}}>
                    unsubscribe
                </button>
            </div>
        </>
    );
};