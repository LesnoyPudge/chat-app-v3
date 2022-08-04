import { log } from '@utils';
import { FC } from 'react';
import { Container } from '../Container';
import { Form } from '../Form';



export const RoomManager: FC = () => {
    

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
                            log('handler not realized');
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
                            log('handler not realized');
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
                            log('handler not realized');
                        },
                    }}
                />
            </Container>

            <Container title='room list'>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>

                </ul>
            </Container>
        </>
    );
};