import { FC, useContext } from 'react';
import { Button,SpriteImage, Ref, TabContext, Tooltip } from '@components';
import { AppSubPageTabs } from '@subPages/AppSubPage';
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
    const { isActive } = useContext<TabContext<AppSubPageTabs>>(TabContext);
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
            <If condition={isActive.allFriends || isActive.onlineFriends}>
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
                                <SpriteImage
                                    className={styles.icon}
                                    name='MESSAGE_BUBBLE_ICON'
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
                                <SpriteImage
                                    className={styles.icon}
                                    name='GARBAGE_CAN_ICON'
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
            </If>

            <If condition={isActive.friendRequests && isIncomingRequest}>
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
                                <SpriteImage
                                    className={styles.icon}
                                    name='CHECK_ICON'
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
                                <SpriteImage
                                    className={styles.icon}
                                    name='CROSS_ICON'
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
            </If>

            <If condition={isActive.friendRequests && !isIncomingRequest}>
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
                                <SpriteImage
                                    className={styles.icon}
                                    name='CROSS_ICON'
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
            </If>

            <If condition={isActive.blocked}>
                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button
                                className={styles.button}
                                label='Разблокировать пользователя'
                                tabIndex={tabIndex}
                                innerRef={ref}
                                onLeftClick={handleUnblock}
                            >
                                <SpriteImage
                                    className={styles.icon}
                                    name='UNBLOCK_ICON'
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
            </If>
        </>
    );
};