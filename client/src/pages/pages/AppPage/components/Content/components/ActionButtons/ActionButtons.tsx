import { FC, useContext } from 'react';
import { Button, Conditional, Icon, RefContextProvider, TabContext, Tooltip } from '@components';
import { AppPageTabs } from '@pages/AppPage/AppPage';
import { getRandomNumber, twClassNames } from '@utils';
import { useNavigator } from '@hooks';



interface ActionButtons {
    userId: string;
    tabIndex: number;
}

const styles = {
    button: `h-9 w-9 p-2 rounded-full bg-primary-300 fill-icon-300 
    hover:fill-icon-100 focus-visible:fill-icon-100`,
    buttonDanger: 'hover:fill-danger focus-visible:fill-danger',
    icon: 'h-full w-full',
};

export const ActionButtons: FC<ActionButtons> = ({
    userId,
    tabIndex,
}) => {
    const { isActive } = useContext(TabContext) as TabContext<AppPageTabs>;
    const { navigateTo } = useNavigator();
    
    const handleNavigateToChat = () => navigateTo.privateChat(userId);
    const handleDeleteFriend = () => console.log('delete friend', userId);
    const handleAcceptFriendRequest = () => console.log('accept', userId);
    const handleRejectFriendRequest = () => console.log('reject', userId);
    const handleRevokeFriendRequest = () => console.log('revoke', userId);
    const handleUnblock = () => console.log('unblock', userId);
    const isIncomingRequest = !!getRandomNumber(0, 1);

    return (
        <>
            <Conditional isRendered={isActive.allFriends || isActive.onlineFriends}>
                <RefContextProvider>
                    <Button 
                        className={styles.button}
                        label='Перейти к сообщениям'
                        tabIndex={tabIndex}
                        onLeftClick={handleNavigateToChat}
                    >
                        <Icon
                            className={styles.icon}
                            iconId='message-bubble-icon'
                        />
                    </Button>

                    <Tooltip preferredAlignment='top'>
                        <>Сообщение</>
                    </Tooltip>
                </RefContextProvider>

                <RefContextProvider>
                    <Button 
                        className={twClassNames(styles.button, styles.buttonDanger)}
                        label='Удалить из друзей'
                        tabIndex={tabIndex}
                        onLeftClick={handleDeleteFriend}
                    >
                        <Icon
                            className={styles.icon}
                            iconId='garbage-can-icon'
                        />
                    </Button>

                    <Tooltip preferredAlignment='top'>
                        <>Удалить из друзей</>
                    </Tooltip>
                </RefContextProvider>
            </Conditional>

            <Conditional isRendered={isActive.friendRequests && isIncomingRequest}>
                <RefContextProvider>
                    <Button 
                        className={styles.button}
                        label='Принять запрос в друзья'
                        tabIndex={tabIndex}
                        onLeftClick={handleAcceptFriendRequest}
                    >
                        <Icon
                            className={styles.icon}
                            iconId='check-icon'
                        />
                    </Button>

                    <Tooltip preferredAlignment='top'>
                        <>Принять</>
                    </Tooltip>
                </RefContextProvider>

                <RefContextProvider>
                    <Button 
                        className={twClassNames(styles.button, styles.buttonDanger)}
                        label='Отклонить запрос в друзья'
                        tabIndex={tabIndex}
                        onLeftClick={handleRejectFriendRequest}
                    >
                        <Icon
                            className={styles.icon}
                            iconId='cross-icon'
                        />
                    </Button>

                    <Tooltip preferredAlignment='top'>
                        <>Отклонить</>
                    </Tooltip>
                </RefContextProvider>
            </Conditional>

            <Conditional isRendered={isActive.friendRequests && !isIncomingRequest}>
                <RefContextProvider>
                    <Button 
                        className={twClassNames(styles.button, styles.buttonDanger)}
                        label='Отозвать запрос в друзья'
                        tabIndex={tabIndex}
                        onLeftClick={handleRevokeFriendRequest}
                    >
                        <Icon
                            className={styles.icon}
                            iconId='cross-icon'
                        />
                    </Button>

                    <Tooltip preferredAlignment='top'>
                        <>Отозвать</>
                    </Tooltip>
                </RefContextProvider>
            </Conditional>

            <Conditional isRendered={isActive.blocked}>
                <RefContextProvider>
                    <Button 
                        className={twClassNames(styles.button)}
                        label='Разблокировать пользователя'
                        tabIndex={tabIndex}
                        onLeftClick={handleUnblock}
                    >
                        <Icon
                            className={styles.icon}
                            iconId='unblock-icon'
                        />
                    </Button>

                    <Tooltip preferredAlignment='top'>
                        <>Разблокировать</>
                    </Tooltip>
                </RefContextProvider>
            </Conditional>
        </>
    );
};