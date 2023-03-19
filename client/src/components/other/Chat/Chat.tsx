import { FC } from 'react';
import { Conditional, EmojiCode, List, Message, Scrollable } from '@components';
import { IMessage } from '@backendTypes';
import { Descendant } from 'slate';
import { loremIpsum } from 'lorem-ipsum';
import { getRandomNumber, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';
import { isSameDay, differenceInMinutes } from 'date-fns';
import { DayDivider } from './components';




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

const getMessage = (index: number): Message => ({
    id: index.toString(),
    user: getRandomNumber(1, 2).toString(),
    chat: '1',
    content: getContent(),
    createdAt: timeline[index],
    updatedAt: Date.now(),
    isChanged: !!getRandomNumber(0, 1),
    isDeleted: false,
    respondOn: [],
    attachments: [],
    reactions: [],
});

const messages = [...Array(messagesLength)].map((_, i) => getMessage(i)).sort((a, b) => a.createdAt - b.createdAt);

const DIFFERENCE_IN_MINUTES_FOR_SMALL_GAP = 5;

const styles = {
    wrapper: 'h-full bg-primary-200',
    scrollable: 'h-full',
    list: 'py-4',
    messageGroupHead: 'message-group-head',
};

export const Chat: FC<Chat> = ({
    className = '',
    // messages,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <Scrollable
                className={styles.scrollable}
                label='Чат'
            >
                {/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role */}
                <div 
                    className={styles.list} 
                    role='feed'
                >
                    <List list={messages}>
                        {(message, index) => {
                            const isFirst = index === 0;
                            const previousMessage = messages[Math.max(0, index - 1)];
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
                </div>
            </Scrollable>
        </div>
    );
};