import { log } from '@utils';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { selectAllChannels, subscribeOnChannel } from '@redux/features';
import { Container, Form } from '@components';



export const ChannelManager: FC = () => {
    const channels = useAppSelector(selectAllChannels);
    const dispatch = useAppDispatch();
    
    return (
        <>
            <Form
                title='create channel form'
                inputs={[
                    {
                        name: 'indentifier',
                    },
                    {
                        name: 'name',
                    },
                ]}
                submit={{
                    text: 'create channel',
                    handler: (values) => {
                        log(values);
                    },
                }}
            />

            <Form
                title='update channel form'
                inputs={[
                    {
                        name: 'name',
                    },
                ]}
                submit={{
                    text: 'update channel',
                    handler: (values) => {
                        log(values);
                    },
                }}
            />

            <Form
                title='delete channel form'
                inputs={[
                    {
                        name: 'channelId',
                    },
                ]}
                submit={{
                    text: 'delete channel',
                    handler: (values) => {
                        log(values);
                    },
                }}
            />

            <Container title='channel subscription'>
                <Form
                    inputs={[
                        {
                            name: 'channelId',
                        },
                    ]}
                    submit={{
                        text: 'subscribe',
                        handler: (values) => {
                            // socket channel subscribe
                            dispatch(subscribeOnChannel(values));
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'channelId',
                        },
                    ]}
                    submit={{
                        text: 'unsubscribe',
                        handler: () => {
                            // socket channel unsubscribe
                        },
                    }}
                />
            </Container>

            <Container title='Channel list'>
                {
                    channels.length ?
                        <ul>
                            {
                                channels.map((channel) => {
                                    return (
                                        <li key={channel.id}>
                                            <span>identifier: {channel.identifier}</span>
                                            
                                            <span>name: {channel.name}</span>
                                            
                                            <span>members: {channel.members}</span>

                                            <span>roles: {channel.roles}</span>
                                        </li>
                                    );
                                })
                            }
                        </ul>

                        :

                        <span>каналов не найдено</span>
                }
            </Container>
        </>
    );
};
