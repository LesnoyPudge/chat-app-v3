import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Descendant } from 'slate';
import { Button, Time, EmojiCode, uniqueEmojiCodeList } from '@components';
import { Heading, SerializedSlateContent } from '@libs';
import { twClassNames } from '@utils';
import { MessageControlBar, MessageImages, MessageReactions, MessageRedactor } from './components';



interface MessageV2 extends PropsWithClassName {
    author: {id: string, name: string, avatar: string};
    mode: 'cozy' | 'compact';
    content: string;
    creationDate: number;
    modified: boolean;
    modificationDate: number | null;
    deleted: boolean;
    attachments: string[];
    reactions: {code: EmojiCode, users: string[]}[];
    inModificationMode: boolean;
    onModificationSubmit: () => void;
    onDelete: () => void;
}

const content: Descendant[] = [
    {
        type: 'paragraph',
        children: [{
            text: 'message content wow amazing',
        }],
    },
];

const message: MessageV2 = {
    author: { id: 'userId', name: 'loshok111', avatar: 'https://i.pravatar.cc/80' },
    mode: 'compact',
    content: JSON.stringify(content),
    creationDate: Date.now(),
    modified: false,
    modificationDate: null,
    deleted: false,
    attachments: [...Array(3)].map(() => 'https://via.placeholder.com/150'),
    reactions: [...Array(5)].map((_, i) => ({ code: uniqueEmojiCodeList[i], users: [...Array(i)].fill(i.toString()) } satisfies {code: EmojiCode, users: string[]})),
    inModificationMode: false,
    onModificationSubmit: () => {},
    onDelete: () => {},
};

const q = {
    timestampId: '1',
    usernameId: '2',
    contentId: '3',
};

const { timestampId, contentId, usernameId } = q;

const isHeadless = false;

const tabIndex = 0;

export const MessageV2: FC = () => {
    return (
        <>
            <CompactMessage/>

            {/* <CozyMessage/> */}
        </>
    );
};


const CozyMessage: FC = () => {
    return (
        <article 
            className='flex flex-col p-2 group hover:bg-primary-hover focus-within:bg-primary-hover'
            aria-labelledby={`${timestampId} ${usernameId} ${contentId}`}
        >
            <Heading 
                className='sr-only' 
                aria-labelledby={`${timestampId} ${usernameId}`}
            />


        </article>
    );
};



const CompactMessage: FC = () => {
    const styles = {
        wrapper: `relative mt-14 pl-2 pr-12 py-1 group bg-primary-200 
        hover:bg-primary-300 focus-within:bg-primary-300`,
        content: 'flex items-baseline',
        heading: 'sr-only',
        time: {
            base: 'inline-block text-xs text-color-muted font-medium mr-2',
            headless: 'opacity-0 group-hover:opacity-100',
        },
        usernameWrapper: 'text-color-primary font-medium',
        username: 'inline underline-offset-4 focus-visible:underline hover:underline',
        messageText: 'inline message-font-size',
    };

    const handleAddReaction = (code: EmojiCode) => console.log('add reaction', code);

    return (
        <article 
            className={styles.wrapper}
            aria-labelledby={`${timestampId} ${usernameId} ${contentId}`}
        >
            <Heading 
                className={styles.heading}
                aria-labelledby={`${timestampId} ${usernameId}`}
            />
                
            <div className={styles.content}>
                <div>
                    <Time
                        className={twClassNames(
                            styles.time.base,
                            { [styles.time.headless]: isHeadless },
                        )}
                        id={timestampId}
                        date={message.creationDate} 
                        format='HH:mm'
                    />
                </div>
            
                <div className='w-full'>
                    <div>
                        <span className={styles.usernameWrapper}>
                            <Button 
                                className={styles.username}
                                id={usernameId}
                                hasPopup='menu'
                                isActive={false}
                                tabIndex={tabIndex}
                                onLeftClick={() => console.log('open user related menu')}
                                onRightClick={() => console.log('open user related menu')}
                            >
                                {message.author.name}
                            </Button>

                            <>: </>
                        </span>

                        <p 
                            className={styles.messageText}
                            id={contentId}
                        >
                            <SerializedSlateContent nodes={message.content}/>
                        </p>
                    </div>

                    <MessageRedactor
                        className='my-2'
                        content={message.content}
                    />

                    <MessageImages 
                        className='my-2' 
                        images={message.attachments.slice(0,0)}
                    />
                        
                    <MessageReactions 
                        className='mb-1'
                        reactions={message.reactions}
                        onReactionAdd={handleAddReaction}
                    />
                </div>
            </div>

            <MessageControlBar 
                className='my-1'
                tabIndex={tabIndex} 
                onReactionAdd={handleAddReaction}
            />
        </article>
    );
};