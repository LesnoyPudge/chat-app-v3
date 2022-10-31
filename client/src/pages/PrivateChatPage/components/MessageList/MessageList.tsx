import { IMessage } from '@backendTypes';
import AutoSizer from 'react-virtualized-auto-sizer';
import Scrollbars from 'react-custom-scrollbars-2';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { MessageItem } from '..';
import { getRandomNumber } from '@utils';



const getMessages = ((size = 20) => {
    return Array(size).fill({}).map((): IMessage => (
        {
            id: Math.random().toString(),
            chat: Math.random().toString(),
            user: getRandomNumber(0, 1).toString(),
            content: 'amazing message ' + Date.now(),
            atttachments: Array(getRandomNumber(0, 7)).fill(''),
            isChanged: false,
            isDeleted: false,
            respondOn: [],
            createdAt: Date.now().toString(),
            updatedAt: '',
        }
    ));
});

export const MessageList: FC = () => {
    const [isRefExist, setIsRefExist] = useState(false);
    const scrollbarsRef = useRef<Scrollbars | null>(null);

    const [messages, setMessages] = useState(getMessages(0));
    
    const getRef = (ref: Scrollbars | null) => {
        scrollbarsRef.current = ref;
        setIsRefExist(true);
    };

    useEffect(() => {
        if (!scrollbarsRef.current) return;
        scrollbarsRef.current.scrollToBottom();
    }, [isRefExist]);

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

    const intervalRef = useRef(0);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setMessages(prev => [...prev, ...getMessages(1)]);
        }, 5000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        console.log(messages);
        // if (!scrollbarsRef.current) return;
        // scrollbarsRef.current.scrollToBottom();
    }, [isRefExist, messages]);

    return (
        <div className='h-full'>
            <AutoSizer>
                {({ height, width }) => (
                    <Scrollbars 
                        style={{ width, height }}
                        ref={getRef}
                    >
                        <ol className='flex flex-col justify-end min-h-full'>
                            {messageList}
                        </ol>
                    </Scrollbars>
                )}
            </AutoSizer>
        </div>
    );
};