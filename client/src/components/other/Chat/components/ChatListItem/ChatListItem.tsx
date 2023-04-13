import { twClassNames } from '@utils';
import { isSameDay, differenceInMinutes } from 'date-fns';
import { useRef, useEffect, FC, RefObject } from 'react';
import { Conditional, Message } from '@components';
import { DayDivider } from '../DayDivider';
import { chatMock } from '../../Chat2';
import { NormalizedViewportItemRefs } from '../../hooks';



interface ChatListItem {
    id: string;
    isFocused: boolean;
    virtualItemsRef: RefObject<NormalizedViewportItemRefs>;
    setFocusedId: (id: string) => void;
}

const styles = {
    messageGroupHead: 'message-group-head',
};

export const ChatListItem: FC<ChatListItem> = ({
    id,
    isFocused,
    virtualItemsRef,
    setFocusedId,
}) => {
    const messageList = chatMock.messages;
    const message = messageList.find(item => item.id === id)!;
    const isFirst = message.id === messageList[0].id;
    const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);

    const isAtStart = false;

    const messageWrapperRef = useRef<HTMLDivElement | null>(null);
    const messageRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!messageRef.current || !messageWrapperRef.current) return;
        if (!virtualItemsRef.current) return;

        const refs = virtualItemsRef.current;

        refs.set(id, {
            messageRef,
            messageWrapperRef,
        });

        return () => {
            refs.delete(id);
        }; 
    }, [id, virtualItemsRef]);

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