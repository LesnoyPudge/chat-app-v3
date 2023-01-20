import { IMessage } from '@backendTypes';
import { FC, useEffect, useRef, useState } from 'react';
import { getRandomNumber } from '@utils';
import { useAutoScroll } from '@hooks';
import { ArrowFocusContextProvider, ArrowFocusItem, MessageItem } from '@components';



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
    const [messages, setMessages] = useState(getMessages(0));
    const { setAutoScrollTriggerRef, setScrollbarRef } = useAutoScroll({ 
        startFromBottom: true,
        autoScrollDependency: [messages],
    });

    const [autoAdd, setAutoAdd] = useState(false);
    const intervalRef = useRef(0);
    const interval = 2000;
    useEffect(() => {
        if (!autoAdd) return;
        intervalRef.current = setInterval(() => {
            setMessages(prev => [...prev, ...getMessages(1)]);
        }, interval);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [autoAdd]);

    return (
        <ArrowFocusContextProvider list={messages} direction='vertical'>
            <>
                <div className='flex gap-8 justify-center'>
                    <button 
                        onClick={() => setMessages(prev => [...prev, ...getMessages(1)])}
                    >
                            add
                    </button>
                    <button
                        onClick={() => setAutoAdd(prev => !prev)}
                    >
                            toggle autoAdd: <span>{`${autoAdd}`}</span>
                    </button>
                </div>

                <div 
                    className='h-full w-full overflow-y-scroll 
                    scrollbar-with-gutter scrollbar-primary' 
                    ref={setScrollbarRef}
                >
                    <ol className='flex flex-col justify-end min-h-full overflow-hidden'>
                        {messages.map((message, index) => {
                            const tmpHead = !!parseInt(message.user);
                            const isFirst = index === 0;

                            return (
                                <li key={message.id}>
                                    <ArrowFocusItem id={message.id}>
                                        {({ tabIndex }) => (
                                            <MessageItem 
                                                message={message}
                                                isHeadless={tmpHead}
                                                isFirst={isFirst}
                                                tabIndex={tabIndex}
                                            />
                                        )}
                                    </ArrowFocusItem>
                                </li>
                            );
                        })}
                    </ol>
                        
                    <div ref={setAutoScrollTriggerRef}></div>
                </div>
            </>
        </ArrowFocusContextProvider>
    );
};