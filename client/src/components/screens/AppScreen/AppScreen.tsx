import { FC, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { UserInfo } from 'src/components/UserInfo/UserInfo';
import { useAppDispatch } from 'src/hooks';
import { logout, useUserLogoutMutation, useUserSomeMutation, useUserUpdateMutation } from 'src/redux/features';



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

    const inputRef = useRef<HTMLInputElement>(null);
    const [update] = useUserUpdateMutation();
    return (
        <>
            <span>app screen</span>
            <button onClick={handleLogout}>
                logout
            </button>

            <button onClick={handleSome}>
                some
            </button>

            <br />

            <input type='text' ref={inputRef}/>
            <button onClick={async() => {
                const text = inputRef.current?.value;

                await update({ username: text || '123' });
            }}>
                update
            </button>

            <UserInfo targetId='62d3ad0e6736eef593b901e5'/>

            <br />

            <UserInfo targetId='62d79d7b3cb7e0d9835e02e0'/>

            <Outlet/>
        </>
    );
};