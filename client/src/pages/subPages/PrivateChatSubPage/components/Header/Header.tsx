import { TopBar, UserStatus } from '@components';
import { Heading } from '@libs';
import { cn } from '@utils';
import { FC, useState } from 'react';
import { Conversation, StartConversationButton } from './components';
import { createContextSelectable } from '@lesnoypudge/utils-react';



const friend = {
    id: '1',
    avatar: 'qwe',
    username: 'friend 1',
    status: 'online',
    extraStatus: 'default',
};

const styles = {
    wrapper: {
        base: 'flex flex-col w-full',
        active: 'bg-primary-500 shadow-elevation-low',
    },
    topBar: {
        base: 'px-4',
        active: 'shadow-none',
    },
    userInfo: 'flex items-center m',
    username: 'font-bold truncated',
    status: 'size-2.5 mx-2.5',
    button: 'ml-auto',
}

type TMPConversationContext = {
    isInConversation: boolean;
    startConversation: () => void;
    endConversation: () => void;
}

export const TMPConversationContext = createContextSelectable<
    TMPConversationContext
>()

export const Header: FC = () => {
    const [isInConversation, setIsInConversation] = useState(true);

    const contextValue: TMPConversationContext = {
        isInConversation,
        startConversation: () => setIsInConversation(true),
        endConversation: () => setIsInConversation(false),
    }

    return (
        <TMPConversationContext.Provider value={contextValue}>
            <div className={cn(styles.wrapper.base, { 
                [styles.wrapper.active]: isInConversation 
            })}>
                
                <TopBar 
                    className={cn(styles.topBar.base, { 
                        [styles.topBar.active]: isInConversation 
                    })}
                    withMobileButton
                >
                    <div className={styles.userInfo}>
                        <Heading className={styles.username}>
                            {friend.username}
                        </Heading>

                        <UserStatus
                            className={styles.status}
                            status='online'
                        />
                    </div>

                    <If condition={!isInConversation}>
                        <StartConversationButton className={styles.button}/>
                    </If>
                </TopBar>

                <If condition={isInConversation}>
                    <Conversation/>
                </If>
            </div>
        </TMPConversationContext.Provider>
    );
};