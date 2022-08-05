import { FC } from 'react';
import { useAppDispatch } from '@hooks';
import { useUserLogoutMutation, useUserSomeMutation, useUserUpdateMutation } from '@redux/features';
import { Form } from '../Form';



export const UserRequests: FC = () => {
    const [logoutRequest] = useUserLogoutMutation();
    const [some] = useUserSomeMutation();
    const dispatch = useAppDispatch();
    
    const handleLogout = async() => {
        logoutRequest();
        // dispatch(logout());
    }; 

    const handleSome = async() => {
        await some();
    };

    const [update] = useUserUpdateMutation();
    
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