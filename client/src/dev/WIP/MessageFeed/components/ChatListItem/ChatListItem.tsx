import { twClassNames } from '@utils';
import { isSameDay, differenceInMinutes } from 'date-fns';
import { useRef, useEffect, FC, RefObject } from 'react';
import {  Message, MessageComponent } from '@components';
import { DayDivider } from '../DayDivider';
// import { chatMock } from '../../Chat';
import { NormalizedViewportItemRefs } from '../../hooks';



interface ChatListItem extends Pick<MessageComponent, 
    'addReaction' | 
    'closeEditor' | 
    'openEditor' | 
    'saveEditor' |
    'isInRedactorMode'
> {
    id: string;
    isFocused: boolean;
    virtualItemsRef: RefObject<NormalizedViewportItemRefs>;
    isFirst: boolean;
    setFocusedId: (id: string) => void;
    getTabIndex: (id: string) => number;
}

const styles = {
    message: 'pr-12 py-1',
    messageGroupHead: 'message-group-head',
};

export const ChatListItem: FC<ChatListItem> = ({
    id,
    isFocused,
    virtualItemsRef,
    isFirst,
    setFocusedId,
    getTabIndex,
    ...rest
}) => {
    const chatMock = {} as any;
    const messageList = chatMock.messages;
    const message = messageList.find(item => item.id === id)!;
    const currentMessageIndex = messageList.findIndex((item) => item.id === message.id);

    const messageWrapperRef = useRef<HTMLDivElement | null>(null);
    const messageRef = useRef<HTMLElement | null>(null);

    const displayMode = 'cozy';
    const tabIndex = getTabIndex(message.id);

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
            : false
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
    const showDayDivider = !isFirst && isNewDay;

    const handleItemClick = () => setFocusedId(message.id);

    return (
        <div 
            aria-hidden
            ref={messageWrapperRef} 
        >
            <If condition={showDayDivider}>
                <DayDivider time={message.createdAt}/>
            </If>
                    
            <div 
                className={twClassNames({
                    [styles.messageGroupHead]: isGroupHead,
                })}
                onClick={handleItemClick}
            >
                <Message
                    className={styles.message}
                    innerRef={messageRef}
                    message={message}
                    displayMode={displayMode}
                    isGroupHead={isGroupHead}
                    tabIndex={tabIndex}
                    {...rest}
                />
            </div>
        </div>
    );
};