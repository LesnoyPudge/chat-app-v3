import { FC, useContext } from 'react';
import { Button, Conditional, Icon, Ref, TabContext, Tooltip } from '@components';
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
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button 
                                className={styles.button}
                                label='Перейти к сообщениям'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleNavigateToChat}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='message-bubble-icon'
                                />
                            </Button>

                            <Tooltip 
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                <>Сообщение</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button 
                                className={twClassNames(styles.button, styles.buttonDanger)}
                                label='Удалить из друзей'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleDeleteFriend}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='garbage-can-icon'
                                />
                            </Button>

                            <Tooltip 
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                <>Удалить из друзей</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </Conditional>

            <Conditional isRendered={isActive.friendRequests && isIncomingRequest}>
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button 
                                className={styles.button}
                                label='Принять запрос в друзья'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleAcceptFriendRequest}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='check-icon'
                                />
                            </Button>

                            <Tooltip 
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                <>Принять</>
                            </Tooltip>
                        </>
                    )}
                </Ref>

                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button 
                                className={twClassNames(styles.button, styles.buttonDanger)}
                                label='Отклонить запрос в друзья'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleRejectFriendRequest}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='cross-icon'
                                />
                            </Button>

                            <Tooltip 
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                <>Отклонить</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </Conditional>

            <Conditional isRendered={isActive.friendRequests && !isIncomingRequest}>
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button 
                                className={twClassNames(styles.button, styles.buttonDanger)}
                                label='Отозвать запрос в друзья'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleRevokeFriendRequest}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='cross-icon'
                                />
                            </Button>

                            <Tooltip 
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                <>Отозвать</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </Conditional>

            <Conditional isRendered={isActive.blocked}>
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button 
                                className={twClassNames(styles.button)}
                                label='Разблокировать пользователя'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleUnblock}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='unblock-icon'
                                />
                            </Button>

                            <Tooltip 
                                preferredAlignment='top'
                                leaderElementRef={ref}
                            >
                                <>Разблокировать</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </Conditional>
        </>
    );
};