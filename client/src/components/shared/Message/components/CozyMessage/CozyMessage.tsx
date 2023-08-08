import { FC, useContext } from 'react';
import { Conditional, UserAvatar } from '@components';
import { MessageContext } from '../../Message';
import { MessageAdditions, MessageContent, MessageCozyTimestamp, MessageTimestamp, MessageUsername } from '..';



const styles = {
    wrapper: 'flex',
    firstCol: 'flex justify-end items-start shrink-0 w-[72px] pr-4',
    avatar: 'w-10 h-10',
    headlessCreationTimestamp: `text-xs leading-none text-color-muted font-medium opacity-0
    group-hover:opacity-100 group-focus-within:opacity-100`,
    secondCol: 'w-full',
    infoRow: 'flex gap-2',
    contentRow: '',
    username: 'font-medium text-color-primary underline-offset-4 focus-visible:underline hover:underline',
};

export const CozyMessage: FC = () => {
    const { message, isGroupHead } = useContext(MessageContext);
    
    const user = {
        id: message.user,
        name: 'loshok111',
        avatar: 'https://i.pravatar.cc/80',
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.firstCol}>
                <Conditional isRendered={isGroupHead}>
                    <UserAvatar
                        className={styles.avatar}
                        avatar={user.avatar}
                        username={user.name}
                    />
                </Conditional>

                <Conditional isRendered={!isGroupHead}>
                    <div>
                        <MessageTimestamp className={styles.headlessCreationTimestamp}/>
                    </div>
                </Conditional>
            </div>

            <div className={styles.secondCol}>
                <Conditional isRendered={isGroupHead}>
                    <div className={styles.infoRow}>
                        <MessageUsername className={styles.username}/>

                        <MessageCozyTimestamp/>
                    </div> 
                </Conditional>
                
                <MessageContent/>

                <MessageAdditions/>
            </div>
        </div>
    );
};