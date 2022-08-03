import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { selectUserInfo, selectUsersById, subscribeOnUser, unsubscribeFromUser } from 'src/redux/features';
import { socketEvents } from '@socket';
import { Form } from '../Form';
import { Container } from '../Container';



interface IUserInfo {
    targetId: string;
}

export const UserInfo: FC<IUserInfo> = ({ targetId }) => {
    const [subscribedOn, setSubscribedOn] = useState('');
    const userFromUsers = useAppSelector(state => selectUsersById(state, subscribedOn));
    const dispatch = useAppDispatch();

    return (
        <>
            <Container title='User subscription'>
                <Form
                    inputs={[
                        {
                            name: 'userId',
                        },
                    ]}
                    submit={{
                        text: 'subscribe',
                        handler(args) {
                            dispatch(subscribeOnUser(args.userId));
                            setSubscribedOn(args.userId);
                        },
                    }}
                />

                <Form
                    inputs={[
                        {
                            name: 'userId',
                        },
                    ]}
                    submit={{
                        text: 'subscribe',
                        handler(args) {
                            dispatch(unsubscribeFromUser(args.userId));
                        },
                    }}
                />
            </Container>

            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                <span>id: {userFromUsers?.id}</span>
                <span>username: {userFromUsers?.username}</span>
                <span>email: {userFromUsers?.email}</span>
                <span>login: {userFromUsers?.login}</span>
            </div>
        </>
    );
};