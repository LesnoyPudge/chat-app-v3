import { SerializedSlateContent } from '@libs';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { Button, Conditional, Time } from '@components';
import { MessageControlBar, MessageImages, MessageReactions, MessageRedactor } from '..';
import { MessageContext } from '../../MessageV2';



const styles = {
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

export const CompactMessage: FC = () => {
    const { isHeadless, ids, tabIndex, message, isInRedactorMode } = useContext(MessageContext) as MessageContext;

    return (
        <div>
            <div className={styles.content}>
                <div>
                    <Time
                        className={twClassNames(
                            styles.time.base,
                            { [styles.time.headless]: isHeadless },
                        )}
                        id={ids.timestampId}
                        date={message.createdAt} 
                        format='HH:mm'
                    />
                </div>
            
                <div className='w-full'>
                    <div>
                        <span className={styles.usernameWrapper}>
                            <Button 
                                className={styles.username}
                                id={ids.usernameId}
                                hasPopup='menu'
                                isActive={false}
                                tabIndex={tabIndex}
                                onLeftClick={() => console.log('open user related menu')}
                                onRightClick={() => console.log('open user related menu')}
                            >
                                {/* <UserName
                                    userId={}
                                    channelId={}
                                /> */}

                                <>loshok111</>
                            </Button>

                            <>: </>
                        </span>

                        <p 
                            className={styles.messageText}
                            id={ids.contentId}
                        >
                            <Conditional isRendered={!isInRedactorMode}>
                                <SerializedSlateContent nodes={message.content}/>
                            </Conditional>
                        </p>
                    </div>

                    <MessageRedactor className='my-2'/>

                    <MessageImages className='my-2'/>
                        
                    <MessageReactions className='mb-1'/>
                </div>
            </div>

            <MessageControlBar className='my-1'/>
        </div>
    );
};