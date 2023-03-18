import { twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { Button, UserName } from '@components';
import { MessageAdditions, MessageContent, MessageTimestamp } from '..';
import { MessageContext } from '../../Message';



const styles = {
    wrapper: 'flex items-baseline pl-4',
    content: 'w-full',
    heading: 'sr-only',
    time: {
        base: 'inline-block text-xs text-color-muted font-medium mr-2',
        headless: 'opacity-0 group-hover:opacity-100',
    },
    usernameWrapper: 'text-color-primary font-medium',
    username: 'inline underline-offset-4 focus-visible:underline hover:underline',   
};

export const CompactMessage: FC = () => {
    const { isHeadless, ids, tabIndex } = useContext(MessageContext) as MessageContext;

    return (
        <div className={styles.wrapper}>
            <div>
                <MessageTimestamp className={twClassNames(
                    styles.time.base,
                    { [styles.time.headless]: isHeadless },
                )}/>
            </div>
            
            <div className={styles.content}>
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
                            <UserName
                                // userId={}
                                // channelId={}
                            />
                        </Button>

                        <>: </>
                    </span>

                    <MessageContent/>
                </div>

                <MessageAdditions/>
            </div>
        </div>
    );
};