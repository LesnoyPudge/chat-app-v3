import { ExtraStatusType, StatusType } from '@backendTypes';
import { EntityContext, EntityContextProvider } from '@components';
import { useNavigator } from '@hooks';
import { FC, useContext } from 'react';
import { Header } from './components';
import { ChatV3 } from 'src/components/shared/ChatV2/ChatV2';



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
    const [privateChannel] = useContext(EntityContext.PrivateChannel);
    // const friend = privateChats.filter(item => item.id === params.privateChatId)[0]?.friend || privateChats[0].friend;
    // const placeholder = `Отправьте сообщение для ${friend.username}`;

    return (
        <EntityContextProvider.Chat id={privateChannel?.chat}>
            <Header/>

            <ChatV3.PrivateChannel/>
        </EntityContextProvider.Chat>
    );
};