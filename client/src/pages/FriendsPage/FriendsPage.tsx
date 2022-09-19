import { IUserPreview } from '@backendTypes';
import { ITab, TabContexProvider } from '@components';
import { FC, useMemo, useState } from 'react';
import { Navigation, SearchBar } from './components';
import { FriendList, FriendRequestList, BlockedList } from './tabs';



type IdentifiersType = 'OnlineFriends' | 'AllFriends' | 'IncomingRequests' | 'Blocked';

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

const tabs: ITab[] = [
    { 
        identifier: 'OnlineFriends', 
        tab: '', 
    },
    { 
        identifier: 'AllFriends', 
        tab: '', 
    },
    { 
        identifier: 'IncomingRequests', 
        tab: '', 
    },
    { 
        identifier: 'Blocked', 
        tab: '', 
    },
];

export const FriendsPage: FC = () => {
    const [filterValue, setFilterValue] = useState('');
    const resetValue = () => setFilterValue('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value);

    const onlyOnlineFriends = useMemo(() => {
        return friends.filter((friend) => friend.status === 'online' && friend.extraStatus !== 'invisible');
    }, [friends]);

    return (
        <TabContexProvider tabs={tabs}>
            {({ currentTab }) => {
                const tabsByIdentifier = {
                    OnlineFriends: <FriendList friends={onlyOnlineFriends} filterValue={filterValue}/>,
                    AllFriends: <FriendList friends={friends} filterValue={filterValue}/>,
                    IncomingRequests: <FriendRequestList filterValue={filterValue}/>,
                    Blocked: <BlockedList filterValue={filterValue}/>,
                };
                const currentIdentifier = currentTab.identifier as IdentifiersType;
                const tabToShow = tabsByIdentifier[currentIdentifier];

                return (
                    <>
                        <Navigation/>

                        <div className='flex flex-col h-full items-start py-4 px-[30px]'>
                            <SearchBar
                                className='mb-5'
                                value={filterValue}
                                onChange={handleChange}
                                onReset={resetValue}
                            />

                            {tabToShow}
                        </div>
                    </>
                );
            }}
        </TabContexProvider>
    );
};