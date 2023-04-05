import { ArrowFocusContextProvider, ArrowFocusItem, Conditional, EmojiCode, List, Message, RefContextProvider } from '@components';
import { PropsWithClassName } from '@types';
import { getRandomNumber, twClassNames } from '@utils';
import { loremIpsum } from 'lorem-ipsum';
import { FC, HTMLAttributes, PropsWithChildren, useEffect, useRef, useState } from 'react';
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
        },
    );

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
                            <HelloFromRoom
                                firstMessageCreationTimestamp={messageList.at(0)?.createdAt}
                            />
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
                                indexesShift={indexesShift}
                                initialPrerender={messageList.length}
                                axis='y'
                                initialAlignToTop={true}
                                scrollThreshold={0}
                                ref={setViewportList}
                                onViewportIndexesChange={(indexes) => {
                                    virtualListRef.current = messageList.slice(indexes[0], indexes[1] + 1);
                                }}
                            >
                                {(message) => {
                                    const isFirst = message.id === messageList[0].id;
                                    const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);
                                    
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
                                        <MoveFocusInside 
                                            disabled={!getIsFocused(message.id)}
                                            key={message.id}
                                        >
                                            <Conditional isRendered={showDayDivider}>
                                                <DayDivider time={message.createdAt}/>
                                            </Conditional>
                                                    
                                            <div 
                                                className={twClassNames({
                                                    [styles.messageGroupHead]: isGroupHead,
                                                })}
                                                aria-hidden
                                            >
                                                <ScrollIntoView 
                                                    enabled={getIsFocused(message.id)}
                                                    options={{
                                                        block: 'center',
                                                    }}
                                                >
                                                    <Message
                                                        message={message}
                                                        displayMode={displayMode}
                                                        isGroupHead={isGroupHead}
                                                        tabIndex={getTabIndex(message.id)}
                                                        // onClick={() => setFocusedId(message.id)}
                                                        isInEditMode={!!editingMessageId && editingMessageId === message.id}
                                                        addReaction={(code) => console.log('add reaction', code)}
                                                        closeEditor={() => setEditingMessageId(null)}
                                                        openEditor={() => setEditingMessageId(message.id)}
                                                        saveEditor={(value) => {
                                                            setEditingMessageId(null);
                                                            console.log('save editor', value);
                                                        }}
                                                    />
                                                </ScrollIntoView>
                                            </div>
                                        </MoveFocusInside>
                                    );
                                }}
                            </ViewportList>
                            
                            {/* <ArrowFocusContextProvider 
                                list={messageList.slice(virtualIndexes[0], virtualIndexes[1])}
                                orientation='vertical'
                                initialId={messageList.at(-1)?.id}
                            >
                                <ViewportList
                                    items={messageList}
                                    // count={messageList.length}
                                    initialIndex={messageList.length - 1}
                                    // overscan={5}
                                    // withCache
                                    indexesShift={indexesShift}
                                    initialPrerender={messageList.length}
                                    ref={setViewportList}
                                    onViewportIndexesChange={(indexes) => {
                                        setVirtualIndexes(indexes);
                                        handleNewIndexes(indexes);
                                    }}
                                >
                                    {(message) => {
                                        return (
                                            <div 
                                                className='h-14'
                                                tabIndex={tabIndex}
                                                key={message.id}
                                            >
                                                <>{message.id}: {String(isFocused)}</>
                                            </div>
                                        );
                                    }}
                                </ViewportList>
                            </ArrowFocusContextProvider> */}
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

interface ScrollIntoView extends 
PropsWithClassName, PropsWithChildren {
    enabled: boolean;
    options?: ScrollIntoViewOptions;
    rest?: HTMLAttributes<HTMLDivElement>;
}

const ScrollIntoView: FC<ScrollIntoView> = ({
    className = '',
    enabled,
    options,
    rest,
    children,
}) => {
    const optionsRef = useLatest(options);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;
        if (!wrapperRef.current) return;

        wrapperRef.current.scrollIntoView(optionsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return (
        <div 
            className={className}
            ref={wrapperRef}
            {...rest}
        >
            {children}
        </div>
    );
};

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