import { Image, TabPanel, Separator, UserAvatar, TabContext, Scrollable, List , MoveFocusInside, ToDo } from '@components';
import { AppSubPageTabs } from '@subPages/AppSubPage';
import { FC, useContext, useRef } from 'react';
import { ActionButtons } from './components';
import { getRandomNumber } from '@utils';
import { useKeyboardNavigation } from '@hooks';
import { Entities } from '@shared';
import { IMAGES } from '@generated';



interface Content {
    value: string;
}

const allFriends: (Entities.User.Preview & Entities.User.WithStatus)[] = [];

const onlineFriends = [...allFriends].filter((friend) => {
    return friend.status === 'online' && friend.extraStatus !== 'invisible';
});
const blocked = [...allFriends].slice(2, 5);
const friendRequests = [...allFriends];

const friends = {
    allFriends,
    onlineFriends,
    blocked,
    friendRequests,
};

const styles = {
    tabPanel: 'flex flex-col h-full overflow-hidden',
    filteredLength: 'text-xs uppercase font-semibold text-color-secondary mx-2.5',
    separator: 'mx-2.5',
    list: 'flex flex-col gap-0.5 py-2',
    listItem: `flex items-center gap-3 h-[60px] py-2 px-2.5 mr-1 rounded-lg 
    hover:bg-primary-hover focus-within:bg-primary-hover`,
    avatar: 'h-8 w-8',
    infoWrapper: 'overflow-hidden',
    username: 'text-color-primary font-semibold truncate',
    extraInfo: 'text-sm text-color-secondary font-medium truncate',
    buttonsContainer: 'flex shrink-0 gap-2.5 ml-auto',
    notFoundWrapper: 'm-auto w-full max-w-[420px]',
    notFoundImage: 'mb-10 max-h-[220px]',
    notFoundText: 'text-color-secondary text-center',
};

export const Content: FC<Content> = ({ value }) => {
    const { currentTab, tabs, tabPanelProps, isActive } = useContext<TabContext<AppSubPageTabs>>(TabContext);

    const filterByName = (users: Entities.User.Preview[]) => {
        if (!value) return users;

        return users.filter((user) => user.username.includes(value));
    };

    const filters: Record<keyof typeof tabs, () => ReturnType<typeof filterByName>> = {
        allFriends: () => filterByName(friends.allFriends),
        blocked: () => filterByName(friends.blocked),
        friendRequests: () => filterByName(friends.friendRequests),
        onlineFriends: () => filterByName(friends.onlineFriends),
    };

    const listToShow = filters[currentTab.identifier]();
    const showList = !!listToShow.length;

    const listToShowRef = useRef(listToShow);
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
    } = useKeyboardNavigation(listToShowRef);

    return (
        <TabPanel
            className={styles.tabPanel}
            {...tabPanelProps[currentTab.identifier]}
        >
            <div className={styles.filteredLength}>
                <>Показано — {listToShow.length}</>
            </div>

            <Separator className={styles.separator} spacing={12}/>

            <If condition={showList}>
                <Scrollable>
                    <ul
                        className={styles.list}
                        tabIndex={0}
                        aria-label='Список запросов'
                        ref={setRoot}
                    >
                        <List list={listToShow}>
                            {(user) => (
                                <MoveFocusInside enabled={getIsFocused(user.id)}>
                                    <li className={styles.listItem} >
                                        <UserAvatar
                                            className={styles.avatar}
                                            {...user}
                                        />

                                        <div className={styles.infoWrapper}>
                                            <div className={styles.username}>
                                                {user.username}
                                            </div>

                                            <If condition={isActive.friendRequests}>
                                                <div className={styles.extraInfo}>
                                                    {
                                                        getRandomNumber(0, 1)
                                                            ? 'Исходящий запрос дружбы'
                                                            : 'Входящий запрос дружбы'
                                                    }
                                                </div>
                                            </If>
                                        </div>

                                        <div className={styles.buttonsContainer}>
                                            <ActionButtons
                                                userId={user.id}
                                                tabIndex={getTabIndex(user.id)}
                                            />
                                        </div>
                                    </li>
                                </MoveFocusInside>
                            )}
                        </List>
                    </ul>
                </Scrollable>
            </If>

            <If condition={!showList}>
                <div className={styles.notFoundWrapper}>
                    <Image
                        className={styles.notFoundImage}
                        src={IMAGES.COMMON.FRIENDSNOTFOUND.PATH}
                    />

                    <ToDo text='показывается даже при пустом поле ввода'>
                        <div className={styles.notFoundText}>
                            <>Вампус внимательно искал, но не нашёл никого с таким именем.</>
                        </div>
                    </ToDo>
                </div>
            </If>
        </TabPanel>
    );
};