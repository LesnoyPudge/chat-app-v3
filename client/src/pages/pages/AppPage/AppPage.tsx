import { SearchBar, TabContextProvider, TabPanel } from '@components';
import { FC, ReactNode, useMemo } from 'react';
import { IUserPreview } from '@backendTypes';
import { Navigation } from './components';
import { FriendList, FriendRequestList, BlockedList } from './tabs';
import { useSearch } from '@hooks';



export interface AppPageTabs {
    onlineFriends: ReactNode;
    allFriends: ReactNode;
    incomingRequests: ReactNode;
    blocked: ReactNode;
}

export const AppPage: FC = () => {
    const { searchValue, handleChange, handleReset } = useSearch();
    
    const friends: IUserPreview[] = useMemo(() => ([
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
    ]), []);
    
    const onlyOnlineFriends = useMemo(() => {
        return friends.filter((friend) => friend.status === 'online' && friend.extraStatus !== 'invisible');
    }, [friends]);

    const tabs = {
        onlineFriends: (
            <TabPanel controls='onlineFriends' label='Друзья в сети'>
                <FriendList friends={onlyOnlineFriends} filterValue={searchValue}/>
            </TabPanel>
        ),
        allFriends: (
            <TabPanel controls='allFriends' label='Все друзья'>
                <FriendList friends={friends} filterValue={searchValue}/>
            </TabPanel>
        ),
        incomingRequests: (
            <TabPanel controls='incomingRequests' label='Входящие запросы дружбы'>
                <FriendRequestList filterValue={searchValue}/>
            </TabPanel>
        ),
        blocked: (
            <TabPanel controls='blocked' label='Исходящие запросы дружбы'>
                <BlockedList filterValue={searchValue}/>
            </TabPanel>
        ),
    };
    
    return (
        <TabContextProvider tabs={tabs}>
            {({ currentTab }) => (
                <>
                    <Navigation/>

                    <div className='flex flex-col h-full items-start py-4 px-[30px]'>
                        <SearchBar
                            className='mb-5 h-9'
                            placeholder='Поиск по имени'
                            label='Имя пользователя'
                            value={searchValue}
                            onChange={handleChange}
                            onReset={handleReset}
                        />

                        {currentTab.tab}
                    </div>
                </>
            )}
        </TabContextProvider>
    );
};