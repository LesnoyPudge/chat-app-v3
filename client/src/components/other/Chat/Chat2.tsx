import { Conditional, EmojiCode, Memo, Message, Scrollable } from '@components';
import { PropsWithClassName } from '@types';
import { FC, RefObject, useState } from 'react';
import { IMessage } from '@backendTypes';
import { ChatListItem, ChatMessagePlaceholderList, HelloFromRoom } from './components';
import { useChat } from './hooks';
import { ViewportList } from 'react-viewport-list';
import { ChatMock } from './ChatMock';
import { SimpleBarCore } from '@reExport';



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

const styles = {
    scrollableWrapper: 'flex grow relative',
    scrollable: 'absolute inset-0 overflow-y-scroll overflow-x-hidden',
    placeholderList: 'flex flex-col gap-4',
};

export const Chat2: FC<Chat> = ({
    className = '',
}) => {
    const [messageList, setMessageList] = useState(initialMessages);

    const {
        indexesShift,
        isAtStart,
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

    const isLoading = false;
    const displayMode = 'cozy' satisfies 'cozy' | 'compact';

    const showHelloMessage = !isLoading && isAtStart;
    const showPlaceholder = !!messageList.length && !isAtStart;

    const addMessage = () => {
        const [_, newMessage] = chatMock.addNewMessage();
        setMessageList(prev => [...prev, ...chatMock.getMessagesAfterTimestamp(newMessage.createdAt)]);
    };

    const setSimpleBar = (ref: SimpleBarCore | null) => {
        if (!ref) return;
        setContentWrapperElement(ref.contentWrapperEl);
        setContentElement(ref.contentEl);
    };
    
    return (
        <div className={className + ' h-full flex flex-col'}>
            <button className='shrink-0' onClick={addMessage}>add</button>

            <Scrollable
                setSimpleBar={setSimpleBar}
                focusable
                label=''
            >
                {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
                <div
                    role='feed'
                    aria-busy
                    aria-label='Сообщения'
                >
                    <Conditional isRendered={isLoading}>
                        <ChatMessagePlaceholderList/>
                    </Conditional>

                    <Conditional isRendered={showHelloMessage}>
                        <HelloFromRoom/>
                    </Conditional>
                    
                    <Conditional isRendered={showPlaceholder}>
                        <ChatMessagePlaceholderList innerRef={setPlaceholderElement}/>
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
                                        isFocused={getIsFocused(id)}
                                        setFocusedId={setFocusedId}
                                        virtualItemsRef={normalizedViewportItemRefs}
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