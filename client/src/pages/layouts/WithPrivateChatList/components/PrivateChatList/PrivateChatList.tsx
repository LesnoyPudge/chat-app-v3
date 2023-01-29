import { ExtraStatusType, StatusType } from '@backendTypes';
import { ArrowFocusContextProvider, ArrowFocusItem } from '@components';
import { Heading } from '@libs';
import { FC } from 'react';
import { PrivateChatItem } from './components';



interface IPrivateChats {
    id: string;
    username: string;
    avatar: string;
    status: StatusType;
    extraStatus: ExtraStatusType;
}

const privateChats: IPrivateChats[] = [
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1 qweqweqweqweqweqweqweqweqweqweqweqweqweqwwew',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
    {
        id: '1' + Math.random().toString(),
        username: 'friend 1',
        avatar: 'https://i.pravatar.cc/51',
        status: 'online',
        extraStatus: 'default',
    },

    {
        id: '2' + Math.random().toString(),
        username: 'friend 2',
        avatar: 'https://i.pravatar.cc/52',
        status: 'offline',
        extraStatus: 'dnd',
    },

    {
        id: '3' + Math.random().toString(),
        username: 'friend 3',
        avatar: 'https://i.pravatar.cc/53',
        status: 'online',
        extraStatus: 'afk',
    },

    {
        id: '4' + Math.random().toString(),
        username: 'friend 4',
        avatar: 'https://i.pravatar.cc/54',
        status: 'online',
        extraStatus: 'dnd',
    },
];

const styles = {
    section: 'flex flex-col overflow-hidden h-full mt-6',
    heading: 'mx-3.5 mb-4 uppercase font-semibold text-xs text-color-base',
    wrapper: `w-full h-full overflow-y-scroll scrollbar-with-gutters 
    scrollbar-primary scrollbar-auto-hidden`,
    list: 'flex flex-col gap-[3px] w-full pt-1 pb-4',
};

export const PrivateChatList: FC = () => {
    return (
        <div className={styles.section}>
            <Heading className={styles.heading}>
                <>Личные сообщения</>
            </Heading>

            <ArrowFocusContextProvider list={privateChats} direction='vertical'>
                <div className={styles.wrapper}>
                    <ul className={styles.list}>
                        {privateChats.map((privateChat) => (
                            <ArrowFocusItem id={privateChat.id} key={privateChat.id}>
                                {({ tabIndex }) => (
                                    <PrivateChatItem 
                                        privateChat={privateChat}
                                        tabIndex={tabIndex}
                                    />
                                )}
                            </ArrowFocusItem>
                        ))}
                    </ul>
                </div>
            </ArrowFocusContextProvider>
        </div>
    );
};