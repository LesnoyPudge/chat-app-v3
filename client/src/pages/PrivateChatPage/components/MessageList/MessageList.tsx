import { IMessage } from '@backendTypes';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { MessageItem } from '..';
import { fpsToMs, getRandomNumber, throttle } from '@utils';
import { Scrollbars, ScrollbarsRefType, AutoSizer } from '@libs';



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
    const isAutoScroll = useRef(true);
    const [isRefExist, setIsRefExist] = useState(false);
    const scrollbarsRef = useRef<ScrollbarsRefType | null>(null);
    const [messages, setMessages] = useState(getMessages(0));
    
    const getRef = (ref: ScrollbarsRefType | null) => {
        scrollbarsRef.current = ref;
        setIsRefExist(true);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (!scrollbarsRef.current) return;
            scrollbarsRef.current.scrollToBottom();   
        });
    };

    useEffect(() => {
        isRefExist && scrollToBottom();
    }, [isRefExist]);

    // const intervalRef = useRef(0);
    // const interval = 1000;
    // useEffect(() => {
    //     intervalRef.current = setInterval(() => {
    //         setMessages(prev => [...prev, ...getMessages(1)]);
    //     }, interval);

    //     return () => {
    //         clearInterval(intervalRef.current);
    //     };
    // }, []);

    useEffect(() => {
        isAutoScroll.current && scrollToBottom();
    }, [messages]);
    
    const handleScroll = throttle(() => {
        if (!scrollbarsRef.current) return;
        const scrollbar = scrollbarsRef.current;
        const { top, clientHeight, scrollHeight } = scrollbar.getValues();
        const isFullyScrolled = top === 1;
        const isSameHeight = clientHeight === scrollHeight;
        const shouldEnableAutoScroll = isFullyScrolled || isSameHeight;
        const shouldDisableAutoScroll = !isFullyScrolled && !isSameHeight;

        if (shouldEnableAutoScroll) isAutoScroll.current = true;
        if (shouldDisableAutoScroll) isAutoScroll.current = false;
    }, fpsToMs(60));

    const handleResize = throttle(() => {
        isAutoScroll.current && scrollToBottom();
    }, fpsToMs(60));

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
        <>
            <button 
                onClick={() => {
                    setMessages(prev => [...prev, ...getMessages(1)]);
                }}
            >
                add message
            </button>

            <div className='h-full w-full overflow-auto'>
                <ol className='flex flex-col justify-end min-h-full'>
                    {messageList}
                </ol>
                {/* <AutoSizer onResize={handleResize}>
                    <Scrollbars
                        autoSized
                        getRef={getRef}
                        onScroll={handleScroll}
                    >
                        <ol className='flex flex-col justify-end min-h-full'>
                            {messageList}
                        </ol>
                    </Scrollbars>
                </AutoSizer> */}
            </div>
        </>
    );
};