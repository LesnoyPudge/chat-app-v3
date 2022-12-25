import { MessageInputBar, MessageList } from '@components';
import { WithTitle } from '@layouts';
import { FC } from 'react';
import { Header } from './components';



export const ChannelPage: FC = () => {
    const placeholder = 'Написать в комнату';
    
    return (
        <WithTitle title='roomName | channelName'>
            <Header/>

            <MessageList/>

            <MessageInputBar placeholder={placeholder}/>
        </WithTitle>
    );
};