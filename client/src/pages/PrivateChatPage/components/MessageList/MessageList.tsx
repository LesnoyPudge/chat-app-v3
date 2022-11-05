import { IMessage } from '@backendTypes';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { MessageItem } from '..';
import { fpsToMs, getRandomNumber, throttle } from '@utils';
import { useAutoScroll } from '@hooks';



const getMessages = ((size = 20) => {
    return Array(size).fill({}).map((): IMessage => (
        {
            id: Math.random().toString(),
            chat: Math.random().toString(),
            user: getRandomNumber(0, 1).toString(),
            content: 'amazing message ' + Date.now(),
            atttachments: Array(getRandomNumber(0, 3)).fill(''),
            isChanged: false,
            isDeleted: false,
            respondOn: [],
            createdAt: Date.now().toString(),
            updatedAt: '',
        }
    ));
});

export const MessageList: FC = () => {
    const scrollbarRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState(getMessages(0));
    const { handleScroll } = useAutoScroll(
        scrollbarRef, 
        { 
            startFromBottom: true,
            autoScrollThreshold: 1,
            autoScrollDependency: [messages],
        },
    );

    const onScroll = throttle(handleScroll, fpsToMs(60));

    const intervalRef = useRef(0);
    const interval = 2000;
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setMessages(prev => [...prev, ...getMessages(1)]);
        }, interval);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const messageList = useMemo(() => (
        messages.map((message) => {
            return (
                <MessageItem 
                    message={message}
                    key={message.id}
                    isHeadless={!!parseInt(message.user)}
                />
            );
        })
    ), [messages]);

    return (
        <div 
            className='h-full w-full overflow-y-scroll scrollbar-with-gutter scrollbar-primary' 
            ref={scrollbarRef}
            onScroll={onScroll}
        >
            <ol className='flex flex-col justify-end min-h-full overflow-hidden'>
                {messageList}
            </ol>
        </div>
    );
};