import { MessageInputBar, Chat, EntityContextProvider, ToDo } from '@components';
import { FC } from 'react';
import { Header } from './components';
import { useNavigator } from '@hooks';
import { Navigate } from 'react-router-dom';



export const ChannelPage: FC = () => {
    const placeholder = 'Написать в комнату';

    return (
        <>
            <EntityContextProvider.Channel id={''}>
                <Header/>

                <Chat/>

                <ToDo text='заменить на отдельный компонент для чата канала'>
                    <MessageInputBar placeholder={placeholder}/>
                </ToDo>
            </EntityContextProvider.Channel>
        </>
    );
};