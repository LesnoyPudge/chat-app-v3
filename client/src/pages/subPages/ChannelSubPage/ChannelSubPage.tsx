import { MessageInputBar, Chat, EntityContextProvider, ToDo } from '@components';
import { FC } from 'react';
import { Header } from './components';
import { useNavigator } from '@hooks';
import { Navigate } from 'react-router-dom';



export const ChannelPage: FC = () => {
    const { params, navigatorPath } = useNavigator();
    const placeholder = 'Написать в комнату';

    return (
        <>
            <If condition={!params.channelId}>
                <Navigate to={navigatorPath.app()} replace/>
            </If>

            <If condition={!!params.channelId}>
                <EntityContextProvider.Channel id={params.channelId!}>
                    <Header/>

                    <Chat/>

                    <ToDo text='заменить на отдельный компонент для чата канала'>
                        <MessageInputBar placeholder={placeholder}/>
                    </ToDo>
                </EntityContextProvider.Channel>
            </If>
        </>
    );
};