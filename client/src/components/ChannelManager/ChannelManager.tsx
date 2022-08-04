import { log } from '@utils';
import { FC } from 'react';
import { useAppDispatch, useAppSelector, useSocket } from '@hooks';
import { selectAllChannels, subscribeOnChannel, unsubscribeFromChannel, useCreateChannelMutation, useDeleteChannelMutation, useUpdateChannelMutation } from '@redux/features';
import { Container, Form } from '@components';



export const ChannelManager: FC = () => {
    const channels = useAppSelector(selectAllChannels);
    const dispatch = useAppDispatch();
    const { connected } = useSocket();
    const [updateChannel] = useUpdateChannelMutation();
    const [createChannel] = useCreateChannelMutation();
    const [deleteChannel] = useDeleteChannelMutation();
    
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
                    handler: async({ identifier, name }) => {
                        await createChannel({ identifier, name });
                    },
                }}
            />

            <Form
                title='update channel form'
                inputs={[
                    {
                        name: 'channelId',
                    },
                    {
                        name: 'name',
                    },
                ]}
                submit={{
                    text: 'update channel',
                    handler: ({ channelId, name }) => {
                        updateChannel({ channelId, newValues: { name } });
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
                    handler: ({ channelId }) => {
                        deleteChannel({ channelId });
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
                            dispatch(subscribeOnChannel(values.channelId));
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
                        handler: (values) => {
                            dispatch(unsubscribeFromChannel(values.channelId));
                        },
                    }}
                />
            </Container>

            <Container title='Channel list'>
                {
                    channels.length ?
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                            {
                                channels.map((channel) => {
                                    return (
                                        <li 
                                            key={channel.id} 
                                            style={{
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: '20px',
                                            }}
                                        >
                                            <span>identifier: {channel.identifier}</span>
                                            
                                            <span>name: {channel.name}</span>
                                            
                                            <span>members: {channel.members}</span>

                                            <span>roles: {channel.roles.length}</span>
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
