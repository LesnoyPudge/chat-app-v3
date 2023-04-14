import { Conditional, EmojiCode, Memo, Message, Scrollable } from '@components';
import { PropsWithClassName } from '@types';
import { createContext, FC, Fragment, RefObject, useState } from 'react';
import { IMessage } from '@backendTypes';
import { ChatListItem, ChatMessagePlaceholderList, DayDivider, HelloFromRoom } from './components';
import { useChat } from './hooks';
import { ViewportList } from 'react-viewport-list';
import { ChatMock } from './ChatMock';
import { SimpleBarCore } from '@reExport';
import { MoveFocusInside } from 'react-focus-lock';
import { noop } from '@utils';
import { Descendant } from 'slate';



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

// const styles = {
//     scrollableWrapper: 'flex grow relative',
//     scrollable: 'absolute inset-0 overflow-y-scroll overflow-x-hidden',
//     placeholderList: 'flex flex-col gap-4',
// };

interface ChatContext {
    messageInRedactorMode: string | null;
    setMessageInRedactorMode: (id: string) => void;
}

export const ChatContext = createContext<ChatContext | undefined>(undefined);

export const Chat2: FC<Chat> = ({
    className = '',
}) => {
    const [messageList, setMessageList] = useState(initialMessages);
    const [redactorId, setRedactorId] = useState<string | null>(null);

    const {
        indexesShift,
        normalizedViewportItemRefs,
        handleViewportIndexesChange,
        setContentElement,
        setContentWrapperElement,
        setPlaceholderElement,
        getIsFocused,
        setAutoScrollTriggerElement,
        setFocusedId,
        setViewportList,
    } = useChat(messageList);

    const isAtStart = true;
    const isLoading = false;

    const showHelloMessage = !isLoading && isAtStart;
    const showPlaceholder = !!messageList.length && !isAtStart;

    const firstMessageCreationTimestamp = messageList.at(0)?.createdAt || Date.now();

    const addMessage = () => {
        const [_, newMessage] = chatMock.addNewMessage();
        setMessageList(prev => [...prev, ...chatMock.getMessagesAfterTimestamp(newMessage.createdAt)]);
    };

    const setSimpleBar = (ref: SimpleBarCore | null) => {
        if (!ref) return;
        setContentWrapperElement(ref.contentWrapperEl);
        setContentElement(ref.contentEl);
    };

    const closeEditor = () => setRedactorId(null);

    const addReaction = (id: string, code: EmojiCode) => {
        console.log('add reactiorn', id, code);
    };

    const saveEditor = (id: string, value: Descendant[]) => {
        console.log('save editor', id, value);
        closeEditor();
    };
    
    return (
        <div className={className + ' h-full flex flex-col'}>
            <button className='shrink-0' onClick={addMessage}>add</button>

            <Scrollable
                setSimpleBar={setSimpleBar}
                focusable
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
                        <HelloFromRoom/>

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
                            onViewportIndexesChange={handleViewportIndexesChange}
                        >
                            {({ id }) => (
                                <Memo key={id}>
                                    <ChatListItem
                                        id={id}
                                        virtualItemsRef={normalizedViewportItemRefs}
                                        isFirst={messageList[0].id === id}
                                        isInRedactorMode={redactorId === id}
                                        isFocused={getIsFocused(id)}
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
        </div>
    );
};