import { ExtraStatusType, StatusType } from '@backendTypes';
import { FC } from 'react';
import { PrivateChatItem } from '..';



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
    return (
        <div className='flex flex-col overflow-hidden h-full'>
            <h2 className='mx-3.5 mb-4 uppercase font-semibold text-xs text-normal'>
                Личные сообщения
            </h2>

            <div className='w-full h-full overflow-y-scroll scrollbar-with-gutters scrollbar-primary'>
                <ul className='flex flex-col gap-[3px] w-full pt-1 pb-4'>
                    {privateChats.map((privateChat, index) => {
                        return (
                            <PrivateChatItem
                                privateChat={privateChat}
                                key={index}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};