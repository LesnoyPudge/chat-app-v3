import { ExtraStatusType, StatusType } from '@backendTypes';
import { MessageInputBar, MessageList } from '@components';
import { useNavigator } from '@hooks';
import { WithTitle } from '@layouts';
import { FC } from 'react';
import { Header } from './components';



interface IPrivateChat {
    id: string;
    friend: {
        id: string;
        avatar: string;
        username: string;
        status: StatusType;
        extraStatus: ExtraStatusType;
    }
}

const privateChats: IPrivateChat[] = [
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

export const PrivateChatPage: FC = () => {
    const { params } = useNavigator();
    const friend = privateChats.filter(item => item.id === params.privateChatId)[0]?.friend || privateChats[0].friend;
    const placeholder = `Отправте сообщение для ${friend.username}`;
    
    return (
        <WithTitle title={friend.username}>
            <Header/>

            <MessageList/>

            <MessageInputBar placeholder={placeholder}/> 
        </WithTitle>
    );
};