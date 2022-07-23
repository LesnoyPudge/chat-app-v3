import { FC, useEffect } from 'react';
import { useAppSelector } from 'src/hooks';
import { selectUserInfo, selectUsersById } from 'src/redux/features';
import { socket } from 'src/utils/socket';



interface IUserInfo {
    targetId: string;
}

export const UserInfo: FC<IUserInfo> = ({ targetId }) => {
    const userFromUsers = useAppSelector(state => selectUsersById(state, targetId));
    const user = useAppSelector(selectUserInfo);

    useEffect(() => {
        socket().emitters.user.subscribe({ userId: user.id, targetId });
        
        return () => {
            socket().emitters.user.unsubscribe({ userId: user.id, targetId });
        };
    }, [targetId, user.id]);

    return (
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
    );
};