import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useSocket } from 'src/hooks';
import { logout, selectUserInfo, selectUsersById, useUserLogoutMutation, useUserSomeMutation } from 'src/redux/features';



export const AppScreen: FC = () => {
    const [logoutRequest] = useUserLogoutMutation();
    const [some] = useUserSomeMutation();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserInfo);
    const userFromUsers = useAppSelector(state => selectUsersById(state, '62d3ad0e6736eef593b901e5'));
    const { eventEmitter, connected } = useSocket();
    console.log(connected);
    const handleLogout = async() => {
        logoutRequest();
        dispatch(logout());
    }; 

    const handleSome = async() => {
        await some();
    };

    useEffect(() => {
        if (!userFromUsers) eventEmitter.user.subscribe({ userId: user.id, targetId: '62d3ad0e6736eef593b901e5' });

        return () => {
            eventEmitter.user.unsubscribe({ userId: user.id, targetId: '62d3ad0e6736eef593b901e5' });
        };
    }, [eventEmitter.user, user.id, userFromUsers]);
    

    return (
        <>
            <span>app screen</span>
            <button onClick={handleLogout}>
                logout
            </button>

            <button onClick={handleSome}>
                some
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span>myId: {user.id}</span>
                <span>id: {userFromUsers?.id}</span>
                <span>username: {userFromUsers?.username}</span>
                <span>email: {userFromUsers?.email}</span>
                <span>login: {userFromUsers?.login}</span>
            </div>

            <Outlet/>
        </>
    );
};