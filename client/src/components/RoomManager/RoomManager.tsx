import { useAppDispatch, useAppSelector } from '@hooks';
import { selectAllRooms, subscribeOnRoom, unsubscribeFromRoom, useCreateRoomMutation, useDeleteRoomMutation, useUpdateRoomMutation } from '@redux/features';
import { log, socket } from '@utils';
import { FC } from 'react';
import { Container } from '../Container';
import { Form } from '../Form';



export const RoomManager: FC = () => {
    const rooms = useAppSelector(selectAllRooms);
    const dispatch = useAppDispatch();
    const [updateRoom] = useUpdateRoomMutation();
    const [createRoom] = useCreateRoomMutation();
    const [deleteRoom] = useDeleteRoomMutation();

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
                            createRoom({ channelId, name, identifier: name });
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'name',
                        },
                        {
                            name: 'roomId',
                        },
                    ]}
                    submit={{
                        text: 'update room',
                        handler({ name, roomId }) {
                            updateRoom({ roomId, newValues: { name } });
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'roomId',
                        },
                    ]}
                    submit={{
                        text: 'delete room',
                        handler({ roomId }) {
                            deleteRoom({ roomId });
                        },
                    }}
                />
            </Container>

            <Container title='room subscription'>
                <Form
                    inputs={[
                        {
                            name: 'roomId',
                        },
                    ]}
                    submit={{
                        text: 'subscribe',
                        handler({ roomId }) {
                            dispatch(subscribeOnRoom(roomId));
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'roomId',
                        },
                    ]}
                    submit={{
                        text: 'unsubscribe',
                        handler({ roomId }) {
                            dispatch(unsubscribeFromRoom(roomId));
                        },
                    }}
                />
            </Container>

            <Container title='room list'>
                {
                    rooms.length ?

                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                            {
                                rooms.map((room) => {
                                    return (
                                        <li 
                                            key={room.id} 
                                            style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: '10px', 
                                            }}
                                        >
                                            <span>id: {room.id}</span>
                                            <span>name: {room.name}</span>
                                            <span>updatedAt: {room.updatedAt}</span>
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