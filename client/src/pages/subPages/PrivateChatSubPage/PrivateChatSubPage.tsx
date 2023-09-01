import { ExtraStatusType, StatusType } from '@backendTypes';
import { MessageInputBar, Chat } from '@components';
import { useNavigator } from '@hooks';
import { FC } from 'react';
import { Header } from './components';



interface PrivateChat {
    id: string;
    friend: {
        id: string;
        avatar: string;
        username: string;
        status: StatusType;
        extraStatus: ExtraStatusType;
    }
}

const privateChats: PrivateChat[] = [
    {
        id: '1',
        friend: {
            id: '1',
            avatar: 'qwe',
            username: 'friend 1',
            status: 'online',
            extraStatus: 'default',
        },
    },
    {
        id: '2',
        friend: {
            id: '2',
            avatar: 'qwe',
            username: 'friend 2',
            status: 'online',
            extraStatus: 'afk',
        },
    },
    {
        id: '3',
        friend: {
            id: '3',
            avatar: 'qwe',
            username: 'friend 3',
            status: 'offline',
            extraStatus: 'default',
        },
    },
    {
        id: '4',
        friend: {
            id: '4',
            avatar: 'qwe',
            username: 'friend 4',
            status: 'online',
            extraStatus: 'dnd',
        },
    },
];

export const PrivateChatSubPage: FC = () => {
    const { params } = useNavigator();
    const friend = privateChats.filter(item => item.id === params.privateChatId)[0]?.friend || privateChats[0].friend;
    const placeholder = `Отправьте сообщение для ${friend.username}`;

    return (
        <>
            <Header/>

            <Chat/>

            <MessageInputBar placeholder={placeholder}/>
        </>
    );
};