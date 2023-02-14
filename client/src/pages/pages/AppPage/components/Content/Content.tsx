import { Image, TabPanel, Separator, UserAvatar, TabContext, Conditional, ArrowFocusContextProvider, ArrowFocusItem, Scrollable } from '@components';
import { AppPageTabs } from '@pages/AppPage/AppPage';
import { FC, useContext } from 'react';
import { IUserPreview } from '@backendTypes';
import { ActionButtons } from './components';
import { getRandomNumber } from '@utils';
import friendsNotFoundImage from '@assets/friendsNotFound.svg';



interface Content {
    value: string;
}

const allFriends: IUserPreview[] = [
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
    const { currentTab, tabs, tabPanelProps, isActive } = useContext(TabContext) as TabContext<AppPageTabs>;

    const filterByName = (users: {username: string}[]): IUserPreview[] => {
        if (!value) return users as IUserPreview[];

        return users.filter((user) => user.username.includes(value)) as IUserPreview[];
    };

    const filters: Record<keyof typeof tabs, () => ReturnType<typeof filterByName>> = {
        allFriends: () => filterByName(friends.allFriends),
        blocked: () => filterByName(friends.blocked),
        friendRequests: () => filterByName(friends.friendRequests),
        onlineFriends: () => filterByName(friends.onlineFriends),
    };

    const listToShow = filters[currentTab.identifier]();
    const showList = !!listToShow.length;

    return (
        <TabPanel 
            className={styles.tabPanel}
            {...tabPanelProps[currentTab.identifier]}
        >
            <div className={styles.filteredLength}>
                <>Показано — {listToShow.length}</>
            </div>

            <Separator className={styles.separator} spacing={12}/>
            
            <Conditional isRendered={showList}>
                <ArrowFocusContextProvider list={listToShow} orientation='both'>
                    <Scrollable>
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

                                                <Conditional isRendered={isActive.friendRequests}>
                                                    <div className={styles.extraInfo}>
                                                        {
                                                            getRandomNumber(0, 1) 
                                                                ? 'Исходящий запрос дружбы' 
                                                                : 'Входящий запрос дружбы'
                                                        }
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
                    </Scrollable>
                </ArrowFocusContextProvider>
            </Conditional>

            <Conditional isRendered={!showList}>
                <div className={styles.notFoundWrapper}>
                    <Image
                        className={styles.notFoundImage}
                        src={friendsNotFoundImage}
                    />

                    <div className={styles.notFoundText}>
                        <>Вампус внимательно искал, но не нашёл никого с таким именем.</>
                    </div>
                </div>
            </Conditional>
        </TabPanel>
    );
};