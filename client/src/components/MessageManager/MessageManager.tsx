import { useAppDispatch, useAppSelector } from '@hooks';
import { selectAllMessages, subscribeOnMessage, unsubscribeFromMessage, useCreateMessageMutation, useDeleteMessageMutation, useUpdateMessageMutation } from '@redux/features';
import { FC } from 'react';
import { Container } from '../Container';
import { Form } from '@components';
import { log } from '@utils';



export const MessageManager: FC = () => {
    const messages = useAppSelector(selectAllMessages);
    const hasMessages = messages.length > 0;
    const dispatch = useAppDispatch();
    const [createMessage] = useCreateMessageMutation();
    const [updateMessage] = useUpdateMessageMutation();
    const [deleteMessage] = useDeleteMessageMutation();

    return (
        <>
            <Container title='Message Requests'>
                <Form
                    title='create message'
                    inputs={[
                        {
                            name: 'chatId',
                        },
                        {
                            name: 'content',
                        },
                    ]}
                    submit={{
                        text: 'create',
                        handler({ chatId, content }) {
                            createMessage({ chatId, content });
                        },
                    }}
                />

                <Form
                    title='update message'
                    inputs={[
                        {
                            name: 'messageId',
                        },
                        {
                            name: 'newValues',
                        },
                    ]}
                    submit={{
                        text: 'update',
                        handler({ messageId, newValues }) {
                            updateMessage({ messageId, newValues });
                        },
                    }}
                />

                <Form
                    title='delete message'
                    inputs={[
                        {
                            name: 'messageId',
                        },
                    ]}
                    submit={{
                        text: 'delete',
                        handler({ messageId }) {
                            deleteMessage({ messageId });
                        },
                    }}
                />
            </Container>

            <Container title='Message Subscription'>
                <Form
                    title='subscribe on message'
                    inputs={[
                        {
                            name: 'messageId',
                        },
                    ]}
                    submit={{
                        text: 'subscribe',
                        handler({ messageId }) {
                            dispatch(subscribeOnMessage(messageId));
                        },
                    }}
                />

                <Form
                    title='unsubscribe from message'
                    inputs={[
                        {
                            name: 'messageId',
                        },
                    ]}
                    submit={{
                        text: 'unsubscribe',
                        handler({ messageId }) {
                            dispatch(unsubscribeFromMessage(messageId));
                        },
                    }}
                />
            </Container>

            <Container title='Message Info'>
                {
                    hasMessages && (
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {
                                messages.map((message) => {
                                    return (
                                        <li key={message.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <span>id: {message.id}</span>
                                            <span>content: {message.content}</span>
                                            <span>user: {message.user}</span>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    )
                }
                {
                    !hasMessages && (
                        <>
                            <span>сообщения не найдены</span>
                        </>   
                    )
                }
            </Container>
        </>
    );
};