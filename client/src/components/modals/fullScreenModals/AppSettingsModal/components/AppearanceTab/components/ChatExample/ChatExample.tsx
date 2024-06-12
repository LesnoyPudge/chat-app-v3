import { List, Message, RTETypes } from '@components';
import { createSingleMessage, noop, twClassNames } from '@utils';
import { FC } from 'react';
import { Descendant } from 'slate';



const messagesContent: RTETypes.Nodes[] = [
    [
        {
            type: 'paragraph',
            children: [{ text: 'Посмотрите на меня, я прекрасная бабочка!' }],
        },
    ],
    [
        {
            type: 'paragraph',
            children: [
                {
                    text: 'Я порхаю при свете луны',
                },
                {
                    type: 'emoji',
                    code: ':smile:',
                    children: [{ text: ':smile:' }],
                },
            ],
        },
    ],
    [
        {
            type: 'paragraph',
            children: [{ text: 'Я жду день, когда' }],
        },
    ],
    [
        {
            type: 'paragraph',
            children: [{ text: 'Компактный режим будет включён...' }],
        },
    ],
    [
        {
            type: 'paragraph',
            children: [{ text: 'О, вот и он!' }],
        },
    ],
];

const styles = {
    wrapper: `flex flex-col justify-center h-[180px] overflow-hidden 
    rounded-md bg-primary-300`,
    message: 'pointer-events-none',
    messageWithHead: 'message-group-head',
};

const messageList = Array(5).fill(null).map((_, i) => ({
    withHead: i % 2 === 0,
    message: createSingleMessage(messagesContent[i]),
}));

export const ChatExample: FC = () => {
    return (
        <div className={styles.wrapper}>
            <List list={messageList}>
                {({ message, withHead }) => {
                    return (
                        <Message
                            className={twClassNames(
                                styles.message,
                                { [styles.messageWithHead]: withHead },
                            )}
                            message={message}
                            isGroupHead={withHead}
                            isInRedactorMode={false}
                            displayMode='cozy'
                            tabIndex={-1}
                            addReaction={noop}
                            closeEditor={noop}
                            openEditor={noop}
                            saveEditor={noop}
                        />
                    );
                }}
            </List>
        </div>
    );
};