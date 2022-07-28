import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AudioSource } from 'src/components/AudioSource';
import { ChannelManager } from 'src/components/ChannelManager';
import { Container } from 'src/components/Container';
import { UserInfo } from 'src/components/UserInfo';
import { UserRequests } from 'src/components/UserRequests';



export const AppScreen: FC = () => {
    return (
        <>
            <Container title='Page name'>
                <span>app screen</span>
            </Container>
            
            <Container title='UserRequests'>
                <UserRequests/>
            </Container>

            <Container title='AudioSource'>
                <AudioSource/>
            </Container>
            
            <Container title='UserInfo'>
                <UserInfo targetId='62d3ad0e6736eef593b901e5'/>
            </Container>

            <Container title='ChannelManager'>
                <ChannelManager/>
            </Container>

            <Container title='Outlet'>
                <Outlet/>
            </Container>
        </>
    );
};