import { createContext, FC, Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Conditional, EmojiCode, List, Message, Scrollable } from '@components';
import { IMessage } from '@backendTypes';
import { Descendant } from 'slate';
import { loremIpsum } from 'lorem-ipsum';
import { getRandomNumber, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';
import { DayDivider, SmoothScroll } from './components';
import { useAutoScroll } from './hooks';
import ViewportList from 'react-viewport-list';
import { useAsync } from 'react-use';
import { useSharedIntersectionObserver } from '@hooks';
import { VirtualList } from './components/VirtualList';
import { VariableSizeList } from 'react-window';
import { AutoSizer } from '@libs';
import ReactList from 'react-list';




type Message = IMessage & {
    reactions: {
        code: EmojiCode;
        users: string[];
    }[];
}

interface Chat extends PropsWithClassName {
    messages?: Message[];
}

const generateEarlierTimestamp = (timestamp: number): number => {
    const maxTimestampMs = timestamp - 1000;
    const minTimestampMs = timestamp - (3 * 24 * 60 * 60 * 1000);
    const randomTimestampMs = Math.floor(Math.random() * (maxTimestampMs - minTimestampMs + 1)) + minTimestampMs;
  
    return randomTimestampMs;
};

const generateTimestampsArray = (count: number): number[] => {
    const timestamps: number[] = [];
    let previousTimestampMs = Date.now();
  
    for (let i = 0; i < count; i++) {
        const timestampMs = i === 0 ? Date.now() : generateEarlierTimestamp(previousTimestampMs);
        timestamps.push(timestampMs);
        previousTimestampMs = timestampMs;
    }
  
    return timestamps.reverse();
};

const messagesLength = 30;

const timeline = generateTimestampsArray(messagesLength);

const getContent = () => {
    const content: Descendant[] = [{
        type: 'paragraph',
        children: [{
            text: loremIpsum({ count: getRandomNumber(1, 6) }),
        }],
    }];

    return JSON.stringify(content);
};

const getMessage = (index: number, createdAt: number = Date.now()): Message => ({
    id: index.toString(),
    user: '1',
    // user: getRandomNumber(1, 2).toString(),
    chat: '1',
    // content: getContent(),
    // content: JSON.stringify([{
    //     type: 'paragraph',
    //     children: [{
    //         text: index.toString(),
    //     }],
    // }]),
    // content: String(index),
    content: `${String(index)}    ${loremIpsum({ count: getRandomNumber(1, 6) })}`,
    // createdAt: timeline[index],
    createdAt,
    updatedAt: Date.now(),
    // isChanged: !!getRandomNumber(0, 1),
    isChanged: false,
    isDeleted: false,
    respondOn: [],
    attachments: [],
    reactions: [],
});

const messages = [...Array(messagesLength)].map((_, i) => getMessage(i));

const DIFFERENCE_IN_MINUTES_FOR_SMALL_GAP = 5;

const styles = {
    wrapper: 'grow bg-primary-200',
    scrollable: 'h-full',
    list: 'flex flex-col justify-end flex-1',
    messageGroupHead: 'message-group-head',
    item: '',
};

// export interface ChatContext {
//     isInEditMode: (messageId: string) => boolean;
//     openEditor: () => void;
//     closeEditor: () => void;
//     saveEditor: () => void;
// }

// export const ChatContext = createContext<ChatContext | undefined>(undefined);

const MessagePlaceholder: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <div aria-hidden={true} className={className}>
            <>placeholder</>
        </div>
    );
};

interface HelloFromRoom extends PropsWithClassName {
    firstMessageCreationTimestamp?: number;
}

const HelloFromRoom: FC<HelloFromRoom> = ({
    className = '',
    firstMessageCreationTimestamp,
}) => {
    return (
        <>
            <div aria-hidden={true} className={className}>
                <>Hello from room</>
            </div>

            <Conditional isRendered={!!firstMessageCreationTimestamp}>
                <DayDivider time={firstMessageCreationTimestamp!}/>
            </Conditional>
        </>
    );
};

const totalAmountOfMessages = 100;
const messageChunkSize = 25;

const roomTimeline = generateTimestampsArray(totalAmountOfMessages);
const roomMessages = Array(totalAmountOfMessages).fill(null).map((_, i) => getMessage(i, roomTimeline[i]));



const getInitialMessagesRequest = (): Promise<Message[]> => {
    const data = roomMessages.slice(-messageChunkSize);
    // console.log('initial messages', data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(roomMessages.slice(-messageChunkSize));
        }, 1500);
    });
};

const getEarlierMessages = (before: number): Promise<Message[]> => {
    const data = roomMessages.filter((message) => message.createdAt < before).slice(-messageChunkSize);
    // console.log('earlier messages', before, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1500);
    });
};

 
export const Chat: FC<Chat> = ({
    className = '',
    // messages,
}) => {
    // const { scrollableRef, setAutoScrollTriggerRef } = useAutoScroll({
    //     startFromBottom: true,
    // });
    
    const [messageList, setMessageList] = useState<Message[]>([]);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [messagesLoadedRecently, setMessagesLoadedRecently] = useState<Message[]>([]);
    const [isAtStart, setIsAtStart] = useState(false);
    const { loading, value, error } = useAsync(() => {
        return getInitialMessagesRequest().then((value) => {
            if (!value) return;
            if (value.length < messageChunkSize) setIsAtStart(true);
            if (value.length) setMessageList(value);
        });
    });

    const handleEarlyMessage = () => getEarlierMessages(messageList.at(0)?.createdAt || Date.now()).then((earlierMessages) => {
        if (earlierMessages.length < messageChunkSize) {
            setIsAtStart(true);
        }

        setMessageList(prev => [...earlierMessages, ...prev]);
    });

    

    const addMessage = () => {
        setMessageList(prev => [...prev, getMessage(prev.length + messagesLoadedRecently.length, Date.now())]);
    };

    const {
        autoScrollTriggerRef,
        resizableWrapperRef,
        // setSimpleBar,
        simpleBarRef,
        isAutoScrollEnabled,
    } = useAutoScroll([messageList]);

    const [_, earlierMessagesPlaceholder] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        if (isIntersecting) handleEarlyMessage();
    });

    const earlyMessages = messageList.slice(0, 20);
    const virtualMessages = messageList.slice(20, -(20));
    const lastMessages = messageList.filter((_, i) => (i > messageList.length - (20 + 1)) && i >= 20);


    return (
        // <ChatContext.Provider value={contextValues}>
        <div className='flex flex-col h-full'>
            <div>
                <button onClick={addMessage}>
                    <>add message</>
                </button>

                <div>messages: {messageList.length}</div>
            </div>

            <div 
                className={twClassNames(styles.wrapper, className)}
                ref={resizableWrapperRef}
            >
                <Scrollable
                    className={styles.scrollable}
                    label='Чат'
                    setSimpleBar={(ref) => simpleBarRef.current = ref}
                >
                    {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
                    {/* <SmoothScroll 
                        deps={[messageList]}
                        isAutoScrollEnabled={isAutoScrollEnabled}
                        disabled={!messageList.length}
                    > */}
                    <div 
                        className={styles.list}
                        role='feed'
                    >
                        <Conditional isRendered={loading}>
                            <div>
                                <>loading...</>
                            </div>
                        </Conditional>

                        <Conditional isRendered={!loading}>
                            {/* <Conditional isRendered={isAtStart}>
                                <HelloFromRoom 
                                    className='h-24'
                                    firstMessageCreationTimestamp={messageList.at(0)?.createdAt}
                                />
                            </Conditional> */}

                            <Conditional isRendered={!!messageList.length}>
                                {/* <Conditional isRendered={!isAtStart}>
                                    <div aria-hidden={true} ref={earlierMessagesPlaceholder}>
                                        <List list={Array(10).fill(null)}>
                                            <MessagePlaceholder className=''/>
                                        </List>
                                    </div>
                                </Conditional> */}

                                <VirtualList
                                    items={messageList}
                                    initialIndex={messageList.length - 1}
                                    withCache
                                    disableBottomFlickering={isAutoScrollEnabled}
                                >
                                    {(message, index) => {
                            
                                        return (
                                            <div key={message.id} className={styles.item}>
                                                <>{message.content}</>
                                            </div>
                                        );
                                    }}
                                </VirtualList>


                                    
                                {/* <ReactList
                                        itemRenderer={(index) => {
                                            return (
                                                <div 
                                                    className={styles.item}
                                                    key={messageList[index].id}
                                                >
                                                    <>{messageList[index].content}</>
                                                </div>
                                            );
                                        }}
                                        length={messageList.length}
                                        type='uniform'
                                    /> */}
                                    

                                {/* <List list={earlyMessages}>
                                        {(message, index) => (
                                            <div key={message.id} className={styles.item}>
                                                <>early {message.content}</>
                                            </div>
                                        )}
                                    </List>

                                    <VirtualList
                                        items={virtualMessages}
                                    >
                                        {(message, index) => (
                                            <div key={message.id} className={styles.item}>
                                                <>virtual {message.content}</>
                                            </div>
                                        )}
                                    </VirtualList> */}


                                {/* <List list={lastMessages}>
                                        {(message, index) => (
                                            <div key={message.id} className={styles.item}>
                                                <>last {message.content}</>
                                            </div>
                                        )}
                                    </List> */}
                            </Conditional>
                        </Conditional>
                    </div>
                    {/* </SmoothScroll> */}

                    <div 
                        className='bg-rose-500' 
                        ref={autoScrollTriggerRef}
                    ></div> 
                </Scrollable>
            </div>
        </div>
        // </ChatContext.Provider>
    );
};


/*
<ViewportList 
                            items={messageList}
                            initialIndex={messageList.length - 1}
                            
                        >
                            {(message, index) => {
                                const isFirst = index === 0;
                                const previousMessage = messageList[Math.max(0, index - 1)];
                                const isPreviousUserSameAsCurrent = previousMessage.user === message.user;
                                const withTimeGap = differenceInMinutes(
                                    previousMessage.createdAt, 
                                    message.createdAt,
                                ) >= DIFFERENCE_IN_MINUTES_FOR_SMALL_GAP;
                                const isNewDay = !isSameDay(previousMessage.createdAt, message.createdAt);
                                const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;
                            
                                return (
                                    <Fragment key={message.id}>
                                        {/* <div>
                                        {message.id}
                                    </div>
                                    <Conditional isRendered={isNewDay}>
                                    <DayDivider time={message.createdAt}/>
                                </Conditional>

                                <Message
                                    className={twClassNames({
                                        [styles.messageGroupHead]: isGroupHead && !isFirst,
                                    })}
                                    message={message}
                                    displayMode='cozy'
                                    isGroupHead={isGroupHead}
                                    tabIndex={0}
                                    isInEditMode={!!editingMessageId && editingMessageId === message.id}
                                    addReaction={(code) => console.log('add reaction', code)}
                                    closeEditor={() => setEditingMessageId(null)}
                                    openEditor={() => setEditingMessageId(message.id)}
                                    saveEditor={(value) => {
                                        setEditingMessageId(null);
                                        console.log('save editor', value);
                                    }}
                                />
                            </Fragment>
                        );
                    }}
                </ViewportList>
                {/* {messageList.map((message, index) => {
                    const isFirst = index === 0;
                    const previousMessage = messageList[Math.max(0, index - 1)];
                    const isPreviousUserSameAsCurrent = previousMessage.user === message.user;
                    const withTimeGap = differenceInMinutes(
                        previousMessage.createdAt, 
                        message.createdAt,
                    ) >= DIFFERENCE_IN_MINUTES_FOR_SMALL_GAP;
                    const isNewDay = !isSameDay(previousMessage.createdAt, message.createdAt);
                    const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;
                    
                    return (
                        <Fragment key={message.id}>
                            <div>
                                {message.id}
                            </div>
                <Conditional isRendered={isNewDay}>
                                <DayDivider time={message.createdAt}/>
                            </Conditional>

                            <Message
                                className={twClassNames({
                                    [styles.messageGroupHead]: isGroupHead && !isFirst,
                                })}
                                message={message}
                                displayMode='cozy'
                                isGroupHead={isGroupHead}
                                tabIndex={0}
                                isInEditMode={!!editingMessageId && editingMessageId === message.id}
                                addReaction={(code) => console.log('add reaction', code)}
                                closeEditor={() => setEditingMessageId(null)}
                                openEditor={() => setEditingMessageId(message.id)}
                                saveEditor={(value) => {
                                    setEditingMessageId(null);
                                    console.log('save editor', value);
                                }}
                            />
                        </Fragment>
                    );
                })}
                <List list={messageList}>
                    {(message, index) => {
                        const isFirst = index === 0;
                        const previousMessage = messageList[Math.max(0, index - 1)];
                        const isPreviousUserSameAsCurrent = previousMessage.user === message.user;
                        const withTimeGap = differenceInMinutes(
                            previousMessage.createdAt, 
                            message.createdAt,
                        ) >= DIFFERENCE_IN_MINUTES_FOR_SMALL_GAP;
                        const isNewDay = !isSameDay(previousMessage.createdAt, message.createdAt);
                        const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;

                        return (
                            <>
                                <Conditional isRendered={isNewDay}>
                                    <DayDivider time={message.createdAt}/>
                                </Conditional>

                                <Message
                                    className={twClassNames({
                                        [styles.messageGroupHead]: isGroupHead && !isFirst,
                                    })}
                                    message={message}
                                    displayMode='cozy'
                                    isGroupHead={isGroupHead}
                                    tabIndex={0}
                                />
                            </>
                        );
                    }}
                </List>
*/