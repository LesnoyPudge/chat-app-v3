import { MessageInputBar, MessageList } from '@components';
import { FC } from 'react';
import { Header } from './components';



export const ChannelPage: FC = () => {
    const placeholder = 'Написать в комнату';
    
    return (
        <>
            <Header/>

            <MessageList/>

            <MessageInputBar placeholder={placeholder}/>
        </>
    );
};