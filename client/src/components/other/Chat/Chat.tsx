import { Conditional, EmojiCode, Memo, Message, Scrollable, Static } from '@components';
import { PropsWithClassName } from '@types';
import { createContext, FC, RefObject, useCallback, useState } from 'react';
import { IMessage } from '@backendTypes';
import { ChatListItem, ChatMessagePlaceholderList, DayDivider, HelloFromRoom } from './components';
import { useChat } from './hooks';
import { ViewportList } from 'react-viewport-list';
import { Descendant } from 'slate';
import { ChatMock } from '@utils';



type Message = IMessage & {
    reactions: {
        code: EmojiCode;
        users: string[];
    }[];
}

interface Chat extends PropsWithClassName {
    messages?: Message[];
}

export interface VirtualItemRefs {
    messageWrapperRef: RefObject<HTMLElement>,
    messageRef: RefObject<HTMLElement>,
}

export const chatMock = new ChatMock(150, 20);

const initialMessages = chatMock.getLastMessagesChunk();

interface ChatContext {
    messageInRedactorMode: string | null;
    setMessageInRedactorMode: (id: string) => void;
}

export const ChatContext = createContext<ChatContext | undefined>(undefined);

export const Chat: FC<Chat> = ({
    className = '',
}) => {
    const [messageList, setMessageList] = useState(initialMessages);
    const [redactorId, setRedactorId] = useState<string | null>(null);

    const {
        indexesShift,
        normalizedViewportItemRefs,
        setViewportIndexes,
        setContentElement,
        setContentWrapperElement,
        setPlaceholderElement,
        getIsFocused,
        getTabIndex,
        setAutoScrollTriggerElement,
        setFocusedId,
        setViewportList,
    } = useChat(messageList);

    const isAtStart = true;
    const isLoading = false;

    const showHelloMessage = !isLoading && isAtStart;
    const showPlaceholder = !!messageList.length && !isAtStart;

    const firstMessageCreationTimestamp = messageList.at(0)?.createdAt || Date.now();

    const closeEditor = useCallback(() => setRedactorId(null), []);

    const addReaction = useCallback((id: string, code: EmojiCode) => {
        console.log('add reaction', id, code);
    }, []);

    const saveEditor = useCallback((id: string, value: Descendant[]) => {
        console.log('save editor', id, value);
        closeEditor();
    }, [closeEditor]);
    
    return (
        <Scrollable
            className={className}
            setScrollable={setContentElement}
            setScrollableWrapper={setContentWrapperElement}
            direction='vertical'
            label='Сообщения'
        >
            <div
                role='feed'
                aria-busy
                aria-label='Лента сообщений'
            >
                <Conditional isRendered={isLoading}>
                    <ChatMessagePlaceholderList/>
                </Conditional>

                <Conditional isRendered={showHelloMessage}>
                    <Static>
                        <HelloFromRoom/>
                    </Static>

                    <DayDivider time={firstMessageCreationTimestamp}/>
                </Conditional>
                    
                <Conditional isRendered={showPlaceholder}>
                    <div 
                        aria-hidden
                        ref={setPlaceholderElement}
                    >
                        <ChatMessagePlaceholderList/>

                        <DayDivider time={firstMessageCreationTimestamp}/>
                    </div>
                </Conditional>

                <Conditional isRendered={!!messageList.length}>
                    <ViewportList
                        items={messageList}
                        initialIndex={messageList.length - 1}
                        withCache
                        overscan={3}
                        indexesShift={indexesShift}
                        initialPrerender={10}
                        axis='y'
                        initialAlignToTop={true}
                        scrollThreshold={0}
                        ref={setViewportList}
                        onViewportIndexesChange={setViewportIndexes}
                    >
                        {({ id }) => (
                            <Memo key={id}>
                                <ChatListItem
                                    id={id}
                                    virtualItemsRef={normalizedViewportItemRefs}
                                    isFirst={messageList[0].id === id}
                                    isInRedactorMode={redactorId === id}
                                    isFocused={getIsFocused(id)}
                                    getTabIndex={getTabIndex}
                                    setFocusedId={setFocusedId}
                                    addReaction={addReaction}
                                    closeEditor={closeEditor}
                                    openEditor={setRedactorId}
                                    saveEditor={saveEditor}
                                />
                            </Memo>
                        )}
                    </ViewportList>
                </Conditional>

                <div 
                    className='h-px'
                    aria-hidden
                    ref={setAutoScrollTriggerElement}
                ></div>
            </div>
        </Scrollable>
    );
};