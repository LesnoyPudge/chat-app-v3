import { MessageInputBar, Chat } from '@components';
import { FC } from 'react';
import { Header } from './components';



export const ChannelPage: FC = () => {
    const placeholder = 'Написать в комнату';

    return (
        <>
            <Header/>

            <Chat/>

            {/* TODO: заменить на отдельный компонент для чата канала */}
            <MessageInputBar placeholder={placeholder}/>
        </>
    );
};