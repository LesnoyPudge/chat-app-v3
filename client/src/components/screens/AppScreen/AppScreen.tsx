import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useUserLogoutMutation, useUserSomeMutation } from 'src/redux/features';



export const AppScreen: FC = () => {
    const [logout] = useUserLogoutMutation();
    const [some] = useUserSomeMutation();

    const handleLogout = async() => {
        await logout();
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