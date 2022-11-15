import { ExtraStatusType, StatusType } from '@backendTypes';
import { FocusableListItem, FocusableListWrapper } from '@components';
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
    heading: 'mx-3.5 mb-4 uppercase font-semibold text-xs text-normal',
    wrapper: `w-full h-full overflow-y-scroll scrollbar-with-gutters 
    scrollbar-primary scrollbar-auto-hidden`,
    list: 'flex flex-col gap-[3px] w-full pt-1 pb-4',
};

export const PrivateChatList: FC = () => {
    return (
        <div className={styles.section}>
            <h2 className={styles.heading}>
                Личные сообщения
            </h2>

            <FocusableListWrapper className={styles.wrapper}>
                <ul className={styles.list}>
                    {privateChats.map((privateChat, index) => {
                        return (
                            <FocusableListItem 
                                index={index}
                                key={privateChat.id}
                            >
                                {({ tabIndex }) => (
                                    <PrivateChatItem 
                                        privateChat={privateChat}
                                        tabIndex={tabIndex}
                                    />
                                )}
                            </FocusableListItem>
                        );
                    })}
                </ul>
            </FocusableListWrapper>
        </div>
    );
};