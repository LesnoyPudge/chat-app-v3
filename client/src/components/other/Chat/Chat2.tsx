import { ArrowFocusContextProvider, ArrowFocusItem, Conditional, EmojiCode, List, Message, RefContextProvider } from '@components';
import { PropsWithClassName } from '@types';
import { getRandomNumber, twClassNames } from '@utils';
import { loremIpsum } from 'lorem-ipsum';
import { FC, Fragment, HTMLAttributes, memo, PropsWithChildren, Ref, RefObject, useEffect, useRef, useState } from 'react';
import { IMessage } from '@backendTypes';
import { DayDivider, HelloFromRoom, MessagePlaceholder } from './components';
import { useChatScroll } from './hooks';
import { ViewportList } from 'react-viewport-list';
import { Descendant } from 'slate';
import { differenceInMinutes, isSameDay } from 'date-fns';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { MoveFocusInside } from 'react-focus-lock';
import { useLatest } from 'react-use';



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

const getContent = (index: number) => {
    const content: Descendant[] = [{
        type: 'paragraph',
        children: [{
            text: `${index} ${loremIpsum({ count: getRandomNumber(1, 3) })}`,
        }],
    }];

    return JSON.stringify(content);
};

const totalAmountOfMessages = 100;
const timeline = generateTimestampsArray(totalAmountOfMessages);

const getMessage = (index: number, createdAt: number = Date.now()): Message => ({
    id: index.toString(),
    user: getRandomNumber(1, 2).toString(),
    chat: '1',
    content: getContent(index),
    createdAt: timeline[index] ? timeline[index] : createdAt,
    updatedAt: Date.now(),
    isChanged: !!getRandomNumber(0, 1),
    isDeleted: false,
    respondOn: [],
    attachments: [],
    reactions: [],
});

const roomTimeline = generateTimestampsArray(totalAmountOfMessages);
const roomMessages = Array(totalAmountOfMessages).fill(null).map((_, i) => getMessage(i, roomTimeline[i]));

const getMessagesBeforeTimestamp = (timestamp: number) => {
    return roomMessages
        .filter((message) => message.createdAt < timestamp)
        .slice(-20);
};

const getMessagesAfterTimestamp = (timestamp: number) => {
    return roomMessages.filter(item => item.createdAt >= timestamp);
};

const initialMessages = roomMessages.slice(-20);

const styles = {
    scrollableWrapper: 'flex grow relative',
    scrollable: 'absolute inset-0 overflow-y-scroll overflow-x-hidden',
    placeholderList: 'flex flex-col gap-4',
    messageGroupHead: 'message-group-head',
};

const PLACEHOLDER_LIST = Array(15).fill(null);

const virtualRefs = new Map<string, {
    messageWrapperRef: RefObject<HTMLElement>,
    messageRef: RefObject<HTMLElement>,
}>([]);
// const virtualItemRef: [RefObject<HTMLElement> | null] = [null];
// const virtualRefs: [RefObject<HTMLElement> | null, RefObject<HTMLElement> | null] = [null, null];

export const Chat2: FC<Chat> = ({
    className = '',
}) => {
    const [messageList, setMessageList] = useState(initialMessages);
    const [isAtStart, setIsAtStart] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

    const {
        setAutoScrollTriggerElement,
        indexesShift,
        setContentElement,
        setContentWrapperElement,
        setViewportList,
        setPlaceholder,
        isPlaceholderVisible,
        contentWrapperElement,
        viewportList,
    } = useChatScroll(messageList);

    const timeoutRef = useRef(0);

    useEffect(() => {
        if (!isPlaceholderVisible) return;
        
        const earlierMessages = getMessagesBeforeTimestamp(messageList[0].createdAt);
        console.log('start');
        timeoutRef.current = setTimeout(() => {  
            if (earlierMessages.length < 20) {
                setIsAtStart(true);
            }
            console.log('do');
            setMessageList(prev => [...earlierMessages, ...prev]);
        }, 3000);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [isPlaceholderVisible, messageList]);

    const isLoading = false;
    const displayMode = 'cozy' satisfies 'cozy' | 'compact';

    const showHelloMessage = !isLoading && isAtStart;
    const showPlaceholder = !!messageList.length && !isAtStart;

    // const [virtualIndexes, setVirtualIndexes] = useState<[number, number]>([0, messageList.length]);
    // const virtualList = messageList.slice(virtualIndexes[0], virtualIndexes[1] + 1);
    const virtualListRef = useRef<Message[]>([]);
    // const [virtualList, setVvirtualList] = useState<Message[]>([]);

    const { 
        getIsFocused, 
        getTabIndex,
        setFocusedId,
    } = useKeyboardNavigation(
        // virtualList,
        virtualListRef,
        contentWrapperElement, 
        {
            direction: 'vertical',
            loop: false,
            initialFocusableId: messageList.at(-1)?.id,
            onFocusChange(item) {
                if (!item || !viewportList) return;

                const index = messageList.findIndex((listItem) => listItem.id === item.id);
                // // console.log('i', index, 'id', item.id);
                if (index === -1) return;

                // const savedItem = virtualItemRef[0]?.current;
                const savedItem = virtualRefs.get(item.id);
                if (!savedItem) return;
                
                // savedItem.messageRef.current?.focus({ preventScroll: true });

                savedItem.messageWrapperRef.current?.scrollIntoView({ block: 'center' });
        
                
                
                // savedItem.focus({ preventScroll: true });
                // savedItem.scrollIntoView({ block: 'center' });
                
                // viewportList.scrollToIndex({
                //     index,
                //     alignToTop: false,
                //     offset: 400,
                //     prerender: 20, 
                // });
            },
        },
    );

    const handleViewportIndexesChange = (indexes: [number, number]) => {
        const startIndex = Math.max(0, indexes[0] - 6);
        const endIndex = Math.min(messageList.length, indexes[1] + 6);

        virtualListRef.current = messageList.slice(
            startIndex, 
            endIndex,
        );
    };

    const addMessage = () => {
        const timestamp = Date.now();
        roomMessages.push(getMessage(roomMessages.length, timestamp));
        setMessageList(prev => [...prev, ...getMessagesAfterTimestamp(timestamp)]);
    };
    
    return (
        <div className={className + ' h-full flex flex-col'}>
            <button className='shrink-0' onClick={addMessage}>add</button>
            <div className={styles.scrollableWrapper}>
                <div 
                    className={styles.scrollable} 
                    ref={setContentWrapperElement}
                    tabIndex={0}
                >
                    {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
                    <div 
                        role='feed'
                        aria-busy
                        aria-label='Сообщения'
                        ref={setContentElement}
                    >
                        <Conditional isRendered={isLoading}>
                            <div 
                                className={styles.placeholderList}
                                aria-hidden
                            >
                                <List list={PLACEHOLDER_LIST}>
                                    <MessagePlaceholder displayMode={displayMode}/>
                                </List>
                            </div>
                        </Conditional>

                        <Conditional isRendered={showHelloMessage}>
                            <HelloFromRoom/>
                        </Conditional>

                        <Conditional isRendered={showPlaceholder}>
                            <div 
                                className={styles.placeholderList}
                                aria-hidden
                                ref={setPlaceholder}
                            >
                                <List list={PLACEHOLDER_LIST}>
                                    <MessagePlaceholder displayMode={displayMode}/>
                                </List>
                            </div>
                        </Conditional>

                        <Conditional isRendered={!!messageList.length}>
                            <ViewportList
                                items={messageList}
                                initialIndex={messageList.length - 1}
                                withCache
                                overscan={10}
                                indexesShift={indexesShift}
                                initialPrerender={20}
                                axis='y'
                                initialAlignToTop={true}
                                scrollThreshold={0}
                                ref={setViewportList}
                                onViewportIndexesChange={handleViewportIndexesChange}
                            >
                                {({ id }) => (
                                    <Item
                                        id={id}
                                        isFocused={getIsFocused(id)}
                                        setFocusedId={setFocusedId}
                                        key={id}
                                    />
                                )}
                            </ViewportList>
                        </Conditional>
                        
                        <div 
                            className='h-px'
                            aria-hidden
                            ref={setAutoScrollTriggerElement}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Qse = ({
    id,
    isFocused,
    setFocusedId,
}: {
    id: string,
    isFocused: boolean,
    setFocusedId: (id: string) => void;
}) => {
    const messageList = roomMessages;
    const message = messageList.find(item => item.id === id)!;
    const isFirst = message.id === messageList[0].id;
    const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);

    const isAtStart = false;

    const messageWrapperRef = useRef<HTMLDivElement | null>(null);
    const messageRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!messageRef.current || !messageWrapperRef.current) return;

        virtualRefs.set(id, {
            messageRef,
            messageWrapperRef,
        });
    }, [id]);

    useEffect(() => {
        if (!messageRef.current) return;
        if (!isFocused) return;

        messageRef.current.focus({ preventScroll: true });
    }, [isFocused]);

    const previousMessage = (
        currentMessageIndex > 0
            ? messageList[currentMessageIndex - 1]
            : null
    );
    
    const isPreviousUserSameAsCurrent = (
        previousMessage 
            ? previousMessage.user === message.user
            : false
    );
    
    const isNewDay = (
        previousMessage
            ? !isSameDay(
                previousMessage.createdAt, 
                message.createdAt,
            )
            : true
    );
    
    const withTimeGap = (
        previousMessage
            ? differenceInMinutes(
                previousMessage.createdAt, 
                message.createdAt,
            ) >= 5
            : false
    );
    
    const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;
    const showDayDivider = isNewDay && !(isAtStart && isFirst);

    return (
        <div 
            aria-hidden
            ref={messageWrapperRef} 
            key={id}
        >
            <Conditional isRendered={showDayDivider}>
                <DayDivider time={message.createdAt}/>
            </Conditional>
                    
            <div 
                className={twClassNames({
                    [styles.messageGroupHead]: isGroupHead,
                })}
            >
                <Message
                    innerRef={messageRef}
                    message={message}
                    displayMode={'cozy'}
                    isGroupHead={isGroupHead}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => setFocusedId(message.id)}
                    isInEditMode={
                        false
                        // !!editingMessageId && editingMessageId === message.id
                    }
                    addReaction={(code) => console.log('add reaction', code)}
                    closeEditor={() => {
                        // setEditingMessageId(null)
                    }}
                    openEditor={() => {
                        // setEditingMessageId(message.id)
                    }}
                    saveEditor={(value) => {
                        // setEditingMessageId(null);
                        console.log('save editor', value);
                    }}
                />
            </div>
        </div>
    );
};

const Item = memo(Qse);



// return (
//     <MoveFocusInside 
//         disabled={!getIsFocused(message.id)}
//         key={message.id}
//     >
//         <div 
//             className='h-14'
//             tabIndex={getTabIndex(message.id)}
//             onClick={() => setFocusedId(message.id)}
//         >
//             <>{message.id}: {String(getIsFocused(message.id))}</>
//         </div>
//     </MoveFocusInside>
// );

// {(index) => {
//     const message = messageList[index];
//     const isFirst = message.id === messageList[0].id;
//     const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);

//     const previousMessage = (
//         currentMessageIndex > 0
//             ? messageList[currentMessageIndex - 1]
//             : null
//     );

//     const isPreviousUserSameAsCurrent = (
//         previousMessage 
//             ? previousMessage.user === message.user
//             : false
//     );

//     const isNewDay = (
//         previousMessage
//             ? !isSameDay(
//                 previousMessage.createdAt, 
//                 message.createdAt,
//             )
//             : true
//     );

//     const withTimeGap = (
//         previousMessage
//             ? differenceInMinutes(
//                 previousMessage.createdAt, 
//                 message.createdAt,
//             ) >= 5
//             : false
//     );

//     const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;
//     const showDayDivider = isNewDay && !(isAtStart && isFirst);

//     return (
//         <div key={message.id}>
//             <Conditional isRendered={showDayDivider}>
//                 <DayDivider time={message.createdAt}/>
//             </Conditional>

//             <div 
//                 className={twClassNames({
//                     [styles.messageGroupHead]: isGroupHead,
//                 })}
//                 aria-hidden
//             >
//                 <Message
//                     message={message}
//                     displayMode={displayMode}
//                     isGroupHead={isGroupHead}
//                     tabIndex={0}
//                     isInEditMode={!!editingMessageId && editingMessageId === message.id}
//                     addReaction={(code) => console.log('add reaction', code)}
//                     closeEditor={() => setEditingMessageId(null)}
//                     openEditor={() => setEditingMessageId(message.id)}
//                     saveEditor={(value) => {
//                         setEditingMessageId(null);
//                         console.log('save editor', value);
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };}


// {(message) => {
//     const isFirst = message.id === messageList[0].id;
//     const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);

//     const previousMessage = (
//         currentMessageIndex > 0
//             ? messageList[currentMessageIndex - 1]
//             : null
//     );
        
//     const isPreviousUserSameAsCurrent = (
//         previousMessage 
//             ? previousMessage.user === message.user
//             : false
//     );

//     const isNewDay = (
//         previousMessage
//             ? !isSameDay(
//                 previousMessage.createdAt, 
//                 message.createdAt,
//             )
//             : true
//     );

//     const withTimeGap = (
//         previousMessage
//             ? differenceInMinutes(
//                 previousMessage.createdAt, 
//                 message.createdAt,
//             ) >= 5
//             : false
//     );

//     const isGroupHead = isFirst || isPreviousUserSameAsCurrent || withTimeGap || isNewDay;
//     const showDayDivider = isNewDay && !(isAtStart && isFirst);

//     return (
//         <div key={message.id}>
//             <Conditional isRendered={showDayDivider}>
//                 <DayDivider time={message.createdAt}/>
//             </Conditional>

//             <div 
//                 className={twClassNames({
//                     [styles.messageGroupHead]: isGroupHead,
//                 })}
//                 aria-hidden
//             >
//                 <Message
//                     message={message}
//                     displayMode={displayMode}
//                     isGroupHead={isGroupHead}
//                     tabIndex={0}
//                     isInEditMode={!!editingMessageId && editingMessageId === message.id}
//                     addReaction={(code) => console.log('add reaction', code)}
//                     closeEditor={() => setEditingMessageId(null)}
//                     openEditor={() => setEditingMessageId(message.id)}
//                     saveEditor={(value) => {
//                         setEditingMessageId(null);
//                         console.log('save editor', value);
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }}