import { IMessage } from '@backendTypes';
import { MessageItem } from '@components';
import { FC } from 'react';
import { Descendant } from 'slate';



const messagesContent: Descendant[][] = [
    [
        {
            text: 'Посмотрите на меня, я прекрасная бабочка!',
        },
    ],
    [
        {
            text: 'Я порхаю при свете луны ',
        },
        {
            type: 'emoji',
            code: ':smile:',
            children: [{ text: '' }],
        },
    ],
    [
        {
            text: 'Я жду день, когда',
        },
    ],
    [
        {
            text: 'Компактный режим будет включён...',
        },
    ],
    [
        {
            text: 'О, вот и он!',
        },
    ],
];

const messages: IMessage[] = messagesContent.map((content, index) => {
    return {
        id: index.toString(),
        chat: '',
        user: '',
        content: JSON.stringify(content),
        atttachments: [],
        respondOn: [],
        isChanged: false,
        isDeleted: false,
        createdAt: Date.now().toString(),
        updatedAt: '',
    };
});

const messagesWithHead = [0, 2, 4];

const styles = {
    wrapper: `flex flex-col justify-center h-[180px] 
    overflow-hidden rounded-md bg-primary-300`,
};

export const ChatExample: FC = () => {
    return (
        <div className={styles.wrapper}>
            {messages.map((message, index) => (
                <MessageItem 
                    message={message}
                    isHeadless={!messagesWithHead.includes(index)}
                    isFirst={index === 0}
                    tabIndex={-1}
                    key={index}
                />
            ))}
        </div>
    );
};