import { ExtraStatusType, StatusType } from '@backendTypes';
import { Button, Icon, RefContextProvider, Tooltip, UserAvatar } from '@components';
import { useNavigateTo } from '@hooks';
import React, { FC } from 'react';



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
    const { navigateToPrivateChat } = useNavigateTo();

    return (
        <div className='flex flex-col'>
            <h2 className='mx-3.5 mb-4 mt-10 uppercase font-semibold text-xs text-normal'>
                Личные сообщения
            </h2>

            {/* <div 
                className='flex flex-col w-full h-full overflow-x-hidden overflow-y-scroll relative custom-scrollbar-variant-primary'
            >
                <ul className='absolute w-full pr-2.5'>
                    {children}
                </ul>
            </div> */}

            <ul className='flex flex-col gap-0.5 mx-1.5 overflow-y-scroll h-[500px] relative h-full'>
                <div className='flex flex-col gap-0.5 absolute h-full'>
                    {
                        privateChats.map(({ id, avatar, extraStatus, status, username }) => {
                            const handleNavigate = () => navigateToPrivateChat({ privateChatId: id });
                            const handleHideChat = () => console.log('chat hidden');
                            const handleKeyDown = (e: React.KeyboardEvent) => {
                                if (e.code === 'Enter') handleNavigate();
                            };

                            return (
                                <li 
                                    className='flex px-2 h-[42px] items-center rounded-md
                                hover:bg-hover focus-visible:bg-hover focus-within:bg-hover group'
                                    tabIndex={0}
                                    key={id}
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
                                        className='ml-3 font-semibold text-muted group-hover:text-normal 
                                    group-focus-visible:text-normal group-focus-within:text-normal'
                                    >
                                        {username}
                                    </span>

                                    <RefContextProvider>
                                        <Button
                                            className='ml-auto flex shrink-0 group-1'
                                            isDefaultStyled={false}
                                            onClick={handleHideChat}
                                        >
                                            <Icon
                                                className='m-auto fill-icon-200 opacity-0
                                            group-hover:opacity-100 group-focus-visible:opacity-100 
                                            group-focus-within:opacity-100 group-1-hover:fill-icon-100
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
                </div>
            </ul>
        </div>
    );
};