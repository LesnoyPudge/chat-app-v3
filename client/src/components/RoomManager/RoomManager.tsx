import { useAppDispatch, useAppSelector } from '@hooks';
import { selectAllTextRooms, subscribeOnTextRoom, unsubscribeFromTextRoom, useCreateTextRoomMutation, useDeleteTextRoomMutation, useUpdateTextRoomMutation } from '@redux/features';
import { log, socket } from '@utils';
import { FC } from 'react';
import { Container } from '../Container';
import { Form } from '../Form';



export const RoomManager: FC = () => {
    const textRooms = useAppSelector(selectAllTextRooms);
    const dispatch = useAppDispatch();
    const [updateTextRoom] = useUpdateTextRoomMutation();
    const [createTextRoom] = useCreateTextRoomMutation();
    const [deleteTextRoom] = useDeleteTextRoomMutation();

    return (
        <>
            <Container title='room requests'>
                <Form
                    inputs={[
                        {
                            name: 'name',
                        },
                        {
                            name: 'channelId',
                        },
                    ]}
                    submit={{
                        text: 'create room',
                        handler({ name, channelId }) {
                            createTextRoom({ channelId, name, identifier: name });
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'name',
                        },
                        {
                            name: 'textRoomId',
                        },
                    ]}
                    submit={{
                        text: 'update room',
                        handler({ name, textRoomId }) {
                            updateTextRoom({ textRoomId, newValues: { name } });
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'textRoomId',
                        },
                    ]}
                    submit={{
                        text: 'delete room',
                        handler({ textRoomId }) {
                            deleteTextRoom({ textRoomId });
                        },
                    }}
                />
            </Container>

            <Container title='room subscription'>
                <Form
                    inputs={[
                        {
                            name: 'textRoomId',
                        },
                    ]}
                    submit={{
                        text: 'subscribe',
                        handler({ textRoomId }) {
                            dispatch(subscribeOnTextRoom(textRoomId));
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'textRoomId',
                        },
                    ]}
                    submit={{
                        text: 'unsubscribe',
                        handler({ textRoomId }) {
                            dispatch(unsubscribeFromTextRoom(textRoomId));
                        },
                    }}
                />
            </Container>

            <Container title='room list'>
                {
                    textRooms.length ?

                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                            {
                                textRooms.map((textRoom) => {
                                    return (
                                        <li 
                                            key={textRoom.id} 
                                            style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: '10px', 
                                            }}
                                        >
                                            <span>id: {textRoom.id}</span>
                                            <span>name: {textRoom.name}</span>
                                            <span>updatedAt: {textRoom.updatedAt}</span>
                                        </li>
                                    );
                                })
                            }
                        </ul>

                        :

                        <span>комнат не найдено</span>
                }
            </Container>
        </>
    );
};