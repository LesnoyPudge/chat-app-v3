import { FC, useEffect } from 'react';
import { useAppDispatch, useWebRTC, useAppSelector } from 'src/hooks';
import { useUserLogoutMutation, useUserSomeMutation, logout, useUserUpdateMutation, selectUserInfo } from 'src/redux/features';
import { socketEvents } from '@socket';
import { Form } from '../Form';



export const UserRequests: FC = () => {
    const [logoutRequest] = useUserLogoutMutation();
    const [some] = useUserSomeMutation();
    const dispatch = useAppDispatch();
    
    const handleLogout = async() => {
        logoutRequest();
        dispatch(logout());
    }; 

    const handleSome = async() => {
        await some();
    };

    const [update] = useUserUpdateMutation();

    useEffect(() => {
        socketEvents.user.joinRooms('123');
    }, []);
    
    return (
        <>
            <button onClick={handleLogout}>
                    logout
            </button>

            <button onClick={handleSome}>
                    some
            </button>

            <Form
                title='User update form'
                inputs={[
                    {
                        name: 'username',
                    },
                ]}
                submit={{
                    text: 'update',
                    handler: async(values: {username: string}) => {
                        await update(values);
                    },
                }}
            />
        </>
    );
};