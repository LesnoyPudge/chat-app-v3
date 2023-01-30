import { TabPanel, Separator, UserAvatar, TabContext, Conditional, ArrowFocusContextProvider, ArrowFocusItem } from '@components';
import { AppPageTabs } from '@pages/AppPage/AppPage';
import { FC, useContext } from 'react';
import { IUserPreview } from '@backendTypes';
import { ActionButtons } from './components';



interface Content {
    searchValue: string;
}

const friends: IUserPreview[] = [
    {
        id: 'weifoerjf',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
        isDeleted: false,
    },
    {
        id: 'gewfwfewfes',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'afk',
        isDeleted: false,
    },
    {
        id: 'sgfbfgb',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
        isDeleted: false,
    },
    {
        id: 'gjk,j,',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
        isDeleted: false,
    },
    {
        id: 'qqwcw',
        username: 'friend 5',
        avatar: 'https://i.pravatar.cc/55',
        status: 'online',
        extraStatus: 'invisible',
        isDeleted: false,
    },
    {
        id: 'dwqdqqdqqdq',
        username: 'русский ник',
        avatar: 'https://i.pravatar.cc/56',
        status: 'online',
        extraStatus: 'default',
        isDeleted: false,
    },
    {
        id: 'nyntbtbtb',
        username: 'qwdqiheifvieiuehvhevfhuei hvheuivheufvhpe;uhvuefhrpvo;jgirbu ijhd;foibuopi;dfjbopifdo;bipdhjfibgoadf9uvhds[hvsdiobj0[d gfhjfhb[ubughboSDVGCusDGOyvcsIVUHigzfvhiuph',
        avatar: 'https://i.pravatar.cc/57',
        status: 'online',
        extraStatus: 'default',
        isDeleted: false,
    },
];

const onlineFriends = [...friends].filter((friend) => {
    return friend.status === 'online' && friend.extraStatus !== 'invisible';
});
const blockedUsers = [...friends].slice(2, 5);
const friendRequests = [...friends];

const styles = {
    tabPanel: 'flex flex-col h-full overflow-hidden',
    filtredLength: 'text-xs uppercase font-semibold text-color-secondary mx-2.5',
    separator: 'mx-2.5',
    listWrapper: 'h-full overflow-y-scroll scrollbar-primary',
    list: 'flex flex-col gap-0.5 py-2',
    listItem: `flex items-center gap-3 h-[60px] py-2 px-2.5 mr-1 rounded-lg 
    hover:bg-primary-hover focus-within:bg-primary-hover`,
    avatar: 'h-8 w-8',
    infoWrapper: 'overflow-hidden',
    username: 'text-color-primary font-semibold truncate',
    extraInfo: 'text-sm text-color-secondary font-medium truncate',
    buttonsContainer: 'flex gap-2.5 ml-auto',
};

export const Content: FC<Content> = ({ searchValue }) => {
    const { currentTab, tabs } = useContext(TabContext) as TabContext<AppPageTabs>;

    const tabPanelLabels = {
        [tabs.onlineFriends.identifier]: 'Друзья в сети',
        [tabs.allFriends.identifier]: 'Все друзья',
        [tabs.friendRequests.identifier]: 'Запросы дружбы',
        [tabs.blocked.identifier]: 'Заблокированные пользователи',
    };

    const filterByName = (users: {username: string}[]) => {
        if (!searchValue) return users;

        return users.filter((user) => user.username.includes(searchValue));
    };

    const filters = {
        [tabs.onlineFriends.identifier]: () => filterByName(onlineFriends),
        [tabs.allFriends.identifier]: () => filterByName(friends),
        [tabs.friendRequests.identifier]: () => filterByName(friendRequests),
        [tabs.blocked.identifier]: () => filterByName(blockedUsers),
    };

    const listToShow = filters[currentTab.identifier]() as IUserPreview[];

    return (
        <TabPanel 
            className={styles.tabPanel} 
            controls={currentTab.identifier}
            label={tabPanelLabels[currentTab.identifier]}
        >
            <div className={styles.filtredLength}>
                <>Показано — {listToShow.length}</>
            </div>

            <Separator className={styles.separator} spacing={12}/>
            
            <ArrowFocusContextProvider list={listToShow} orientation='both'>
                <div className={styles.listWrapper}>
                    <ul className={styles.list}>
                        {listToShow.map((user) => (
                            <ArrowFocusItem id={user.id} key={user.id}>
                                {({ tabIndex }) => (
                                    <li className={styles.listItem} >
                                        <UserAvatar
                                            className={styles.avatar}
                                            avatar={user.avatar}
                                            username={user.username}
                                            status={user.status}
                                            extraStatus={user.extraStatus}
                                        />

                                        <div className={styles.infoWrapper}>
                                            <div className={styles.username}>
                                                {user.username}
                                            </div>

                                            <Conditional isRendered={true}>
                                                <div className={styles.extraInfo}>
                                                    <>some info</>
                                                </div>
                                            </Conditional>
                                        </div>

                                        <div className={styles.buttonsContainer}>
                                            <ActionButtons 
                                                userId={user.id} 
                                                tabIndex={tabIndex}
                                            />
                                        </div>
                                    </li>
                                )}
                            </ArrowFocusItem>
                        ))}
                    </ul>
                </div>
            </ArrowFocusContextProvider>
        </TabPanel>
    );
};