import { FC } from 'react';
import { EmojiCode, List, Message, Scrollable } from '@components';
import { IMessage } from '@backendTypes';
import { Descendant } from 'slate';
import { loremIpsum } from 'lorem-ipsum';
import { getRandomNumber, twClassNames } from '@utils';
import { PropsWithClassName } from '@types';




type Message = IMessage & {
    reactions: {
        code: EmojiCode;
        users: string[];
    }[];
}

interface Chat extends PropsWithClassName {
    messages?: Message[];
}

const getContent = () => {
    const content: Descendant[] = [{
        type: 'paragraph',
        children: [{
            text: loremIpsum({ count: getRandomNumber(1, 6) }),
        }],
    }];

    return JSON.stringify(content);
};

const messages = [...Array(20)].map((_, i) => ({
    id: i.toString(),
    user: i.toString(),
    chat: '1',
    content: getContent(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isChanged: !!getRandomNumber(0, 1),
    isDeleted: !!getRandomNumber(0, 10),
    respondOn: [],
    attachments: [],
    reactions: [],
} satisfies Message));

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
                <div className={styles.list}>
                    <List list={messages}>
                        {(message, index) => {
                            const isFirst = index === 0;
                            const isHeadless = !!getRandomNumber(0, 5) || isFirst;
                            
                            return (
                                <Message
                                    className={twClassNames({
                                        [styles.messageGroupHead]: !isHeadless && !isFirst,
                                    })}
                                    message={message}
                                    displayMode='compact'
                                    isHeadless={isHeadless}
                                    tabIndex={0}
                                />
                            );
                        }}
                    </List>
                </div>
            </Scrollable>
        </div>
    );
};