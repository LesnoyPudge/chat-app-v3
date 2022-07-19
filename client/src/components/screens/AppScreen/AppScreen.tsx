import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks';
import { logout, useUserLogoutMutation, useUserSomeMutation } from 'src/redux/features';



export const AppScreen: FC = () => {
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

    return (
        <>
            <span>app screen</span>
            <button onClick={handleLogout}>
                logout
            </button>

            <button onClick={handleSome}>
                some
            </button>

            <Outlet/>
        </>
    );
};