import { Button, ContextMenu, Icon, RefContextProvider, Separator, Tooltip, UserAvatar } from '@components';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { IUserPreview } from '@backendTypes';
import { ActionButton } from '../../components';
import { useNavigateTo } from '@hooks';



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

export const AllFriends: FC = () => {
    const { navigateToPrivateChat } = useNavigateTo();
    const [filterValue, setFilterValue] = useState('');

    const filtredFriends = useMemo(() => {
        return filterValue ? friends.filter((friend) => friend.username.match(filterValue)) : friends;
    }, [filterValue]);

    const isFiltred = !!(friends.length - filtredFriends.length);

    return (
        <div className='flex flex-col items-start py-4 px-[30px] h-full'>
            <div className=''>
                <input 
                    type='text' 
                    placeholder='Поиск по имени'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterValue(e.target.value);
                    }}
                />
            </div>

            <div className='uppercase'>
                <>
                    Всего друзей - {friends.length} 
                    {isFiltred && `Показано - ${filtredFriends.length}`}
                </>
            </div>

            <ul 
                className='flex flex-col w-full h-full overflow-x-hidden 
                overflow-y-scroll relative custom-scrollbar-variant-primary'
            >
                <div className='absolute w-full pr-2.5'>
                    {
                        filtredFriends.map((friend) => {
                            return (
                                <Fragment key={friend.id}>
                                    <Separator spacing={4} thikness={2}/>

                                    <RefContextProvider>
                                        <li 
                                            className='flex items-center py-2 px-2.5 rounded-lg
                                            hover:bg-hover focus-within:bg-hover group-1'
                                        >
                                            <UserAvatar
                                                className='mr-3'
                                                size={32}
                                                avatar={friend.avatar} 
                                                username={friend.username} 
                                                status={friend.status} 
                                                extraStatus={friend.extraStatus}
                                            />

                                            <div 
                                                className='font-semibold text-primary mr-5
                                                overflow-hidden text-ellipsis whitespace-nowrap'
                                            >
                                                {friend.username}
                                            </div>

                                            <ActionButton 
                                                buttonClassName='ml-auto'
                                                iconId='message-bubble-icon' 
                                                tooltipContent='Написать сообщение'
                                                onClick={() => navigateToPrivateChat({ privateChatId: friend.id })}
                                            />

                                            <ActionButton
                                                buttonClassName='ml-2'
                                                iconClassName='group-2-hover:fill-red
                                                group-2-focus-visible:fill-red'
                                                iconId='garbage-can-icon'
                                                tooltipContent='Удалить из друзей'
                                                onClick={() => {console.log('delete friend');}}
                                            />
                                        </li>
                                    
                                        <ContextMenu>
                                            <>menu for: {friend.username}</>
                                        </ContextMenu>
                                    </RefContextProvider>
                                </Fragment>
                            
                            );
                        })
                    }
                </div>
            </ul>
        </div>
    );
};