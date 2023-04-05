import { Conditional, EmojiCode, List, Message } from '@components';
import { PropsWithClassName } from '@types';
import { getRandomNumber, twClassNames } from '@utils';
import { loremIpsum } from 'lorem-ipsum';
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IMessage } from '@backendTypes';
import { DayDivider, HelloFromRoom, MessagePlaceholder } from './components';
import { useChatScroll } from './hooks';
import { ViewportList } from 'react-viewport-list';
import { Descendant } from 'slate';
import { differenceInMinutes, isSameDay } from 'date-fns';



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

const initialMessages = roomMessages.slice(-20);

const styles = {
    scrollableWrapper: 'h-full relative',
    scrollable: 'absolute inset-0 overflow-y-scroll overflow-x-hidden',
    placeholderList: 'flex flex-col gap-4',
    messageGroupHead: 'message-group-head',
};

const PLACEHOLDER_LIST = Array(15).fill(null);

export const Chat: FC<Chat> = ({
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
        // handleNewIndexes,
        setPlaceholder,
        isPlaceholderVisible,
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
    
    return (
        <div className={className}>
            <div className={styles.scrollableWrapper}>
                <div 
                    className={styles.scrollable} 
                    ref={setContentWrapperElement}
                >
                    {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
                    <div 
                        role='feed'
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
                                // withCache
                                indexesShift={indexesShift}
                                initialPrerender={messageList.length}
                                ref={setViewportList}
                                // onViewportIndexesChange={handleNewIndexes}
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
                                        <div key={message.id}>
                                            <Conditional isRendered={showDayDivider}>
                                                <DayDivider time={message.createdAt}/>
                                            </Conditional>

                                            <div 
                                                className={twClassNames({
                                                    [styles.messageGroupHead]: isGroupHead,
                                                })}
                                                aria-hidden
                                            >
                                                <Message
                                                    message={message}
                                                    displayMode={displayMode}
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
                                            </div>
                                        </div>
                                    );
                                }}
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