import { createContext, FC, Fragment, useState } from 'react';
import { Conditional, EmojiCode, List, Message, Scrollable } from '@components';
import { IMessage } from '@backendTypes';
import { Descendant } from 'slate';
import { loremIpsum } from 'lorem-ipsum';
import { getRandomNumber, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';
import { isSameDay, differenceInMinutes } from 'date-fns';
import { DayDivider } from './components';
// import { useAutoScroll } from '@hooks';
import { useAutoScroll } from './hooks';
import ViewportList from 'react-viewport-list';




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
  
    return timestamps;
};

const messagesLength = 300;

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

const getMessage = (index: number): Message => ({
    id: index.toString(),
    user: '1',
    // user: getRandomNumber(1, 2).toString(),
    chat: '1',
    // content: getContent(),
    content: JSON.stringify([{
        type: 'paragraph',
        children: [{
            text: index.toString(),
        }],
    }]),
    // createdAt: timeline[index],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    // isChanged: !!getRandomNumber(0, 1),
    isChanged: false,
    isDeleted: false,
    respondOn: [],
    attachments: [],
    reactions: [],
});

const messages = [...Array(messagesLength)].map((_, i) => getMessage(i)).sort((a, b) => a.createdAt - b.createdAt);

const DIFFERENCE_IN_MINUTES_FOR_SMALL_GAP = 5;

const styles = {
    wrapper: 'grow bg-primary-200',
    scrollable: 'h-full',
    list: 'py-4',
    messageGroupHead: 'message-group-head',
};

// export interface ChatContext {
//     isInEditMode: (messageId: string) => boolean;
//     openEditor: () => void;
//     closeEditor: () => void;
//     saveEditor: () => void;
// }

// export const ChatContext = createContext<ChatContext | undefined>(undefined);

export const Chat: FC<Chat> = ({
    className = '',
    // messages,
}) => {
    // const { scrollableRef, setAutoScrollTriggerRef } = useAutoScroll({
    //     startFromBottom: true,
    // });
    const [messageList, setMessageList] = useState(messages);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

    const addMessage = () => {
        setMessageList(prev => [...prev, getMessage(prev.length)]);
    };

    const {
        autoScrollTriggerRef,
        resizableContentRef,
        simpleBarRef,
    } = useAutoScroll();

    // const { scrollableRef, setAutoScrollTriggerRef } = useAutoScroll({ startFromBottom: true });

    // const contextValues: ChatContext = {
    //     isInEditMode: (messageId) => true,
    //     closeEditor: () => {},
    //     openEditor: () => {},
    //     saveEditor: () => {},
    // };

    return (
        // <ChatContext.Provider value={contextValues}>
        <div className='flex flex-col h-full'>
            <div>
                <button onClick={addMessage}>
                    <>add message</>
                </button>

                <div>messages: {messageList.length}</div>
            </div>

            <div className={twClassNames(styles.wrapper, className)}>
                <Scrollable
                    className={styles.scrollable}
                    label='Чат'
                    simpleBarRef={simpleBarRef}
                    // scrollableRef={scrollableRef}
                >
                    {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
                    <div 
                        className={styles.list}
                        role='feed'
                        ref={resizableContentRef}
                    >
                        <ViewportList items={messageList}>
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
                                    </div> */}
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
                                    {/* <div>
                                        {message.id}
                                    </div> */}
                        {/* <Conditional isRendered={isNewDay}>
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
                        })} */}
                        {/* <List list={messageList}>
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
                        </List> */}
                    </div>
                
                    {/* <div ref={setAutoScrollTriggerRef}></div> */}
                    <div ref={autoScrollTriggerRef}></div>
                </Scrollable>
            </div>
        </div>
        // </ChatContext.Provider>
    );
};