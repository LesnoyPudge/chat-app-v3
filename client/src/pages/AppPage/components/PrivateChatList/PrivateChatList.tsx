import { ExtraStatusType, StatusType } from '@backendTypes';
import { Button, Icon, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useNavigator } from '@hooks';
import classNames from 'classnames';
import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface IPrivateChats {
    id: string;
    username: string;
    avatar: string;
    status: StatusType;
    extraStatus: ExtraStatusType;
}

const privateChats: IPrivateChats[] = [
    {
        id: '1',
        username: 'friend 1 qweqweqweqweqweqweqweqweqweqweqweqweqweqwwew',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1',
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2',
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3',
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4',
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
];

export const PrivateChatList: FC = () => {
    const { navigateTo, myLocationIs } = useNavigator();

    return (
        <div className='flex flex-col shrink-0 grow'>
            <h2 className='mx-3.5 mb-4 uppercase font-semibold text-xs text-normal'>
                Личные сообщения
            </h2>

            <div 
                className='flex flex-col overflow-x-hidden overflow-y-scroll relative 
                h-full custom-scrollbar-variant-primary custom-scrollbar-w-2'
            >
                <ul className='flex flex-col gap-[3px] absolute w-full pt-1 pb-4'>
                    {
                        privateChats.map(({ id, avatar, extraStatus, status, username }, index) => {
                            const handleNavigate = () => navigateTo.privateChat(id);
                            const handleHideChat = () => console.log('chat hidden');
                            const handleKeyDown = (e: React.KeyboardEvent) => {
                                if (e.code === 'Enter') handleNavigate();
                            };
                            const isActive = myLocationIs.privateChat(id);

                            return (
                                <li 
                                    className={twMerge(classNames(
                                        `flex shrink-0 ml-2 mr-0.5 pl-2 pr-1 h-[42px] items-center 
                                        rounded-md cursor-pointer hover:bg-hover focus-visible:bg-hover 
                                        focus-within:bg-hover group`,
                                        { 'bg-hover' : isActive },
                                    ))}
                                    tabIndex={0}
                                    key={id + index}
                                    onClick={handleNavigate}
                                    onKeyDown={handleKeyDown}
                                >
                                    <UserAvatar
                                        className=''
                                        avatar={avatar}
                                        username={username}
                                        status={status}
                                        extraStatus={extraStatus}
                                        size={32}
                                    />

                                    <span 
                                        className={twMerge(classNames(
                                            `ml-3 font-medium text-muted overflow-hidden
                                            text-ellipsis whitespace-nowrap group-hover:text-normal 
                                            group-focus-visible:text-normal group-focus-within:text-normal`,
                                            { 'text-normal': isActive },
                                        ))}
                                    >
                                        {username}
                                    </span>

                                    <RefContextProvider>
                                        <Button
                                            className={twMerge(classNames(
                                                `ml-auto flex shrink-0 h-7 w-7 opacity-0
                                                group-hover:opacity-100 group-focus-visible:opacity-100 
                                                group-focus-within:opacity-100 group-1`,
                                                { 'opacity-100': isActive },
                                            ))}
                                            isntStyled
                                            onClick={handleHideChat}
                                        >
                                            <Icon
                                                className='m-auto fill-icon-200 group-1-hover:fill-icon-100
                                                group-1-focus-visible:fill-icon-100 transition-none'
                                                iconId='cross-icon'
                                                height={20}
                                                width={20}
                                            />
                                        </Button>

                                        <Tooltip position='right' spacing={16}>
                                            <>Срыть</>
                                        </Tooltip>
                                    </RefContextProvider>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
    );
};