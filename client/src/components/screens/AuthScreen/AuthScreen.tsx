import { FC, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import { getUser, useUserLoginMutation, useUserRegistrationMutation } from 'src/redux/features';



export const AuthScreen: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [registration, { isLoading }] = useUserRegistrationMutation();
    const loginRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function handleRegistrationSubmit(e: React.FormEvent) {
        e.preventDefault();

        const data = {
            login: loginRef.current!.value,
            email: emailRef.current!.value,
            username: usernameRef.current!.value,
            password: passwordRef.current!.value,
        };
        await registration(data);
    }

    const [login, { isLoading: isLoginLoading }] = useUserLoginMutation();
    const loginLoginRef = useRef<HTMLInputElement>(null);
    const loginPasswordRef = useRef<HTMLInputElement>(null);

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();

        const data = {
            login: loginLoginRef.current!.value,
            password: loginPasswordRef.current!.value,
        };

        await login(data);
    }

    const user = useAppSelector(getUser);
    
    useEffect(() => {
        const handleRedirect = () => {
            const state = location.state as {from?: {pathname: string}}; 
            const from = state?.from?.pathname || '/app';
            console.log('redirect after success auth to: ', from);
            navigate(from, { replace: true });        
        };

        if (user.isAuth) handleRedirect();
    }, [location.state, navigate, user.isAuth]);

    return (
        <>
            <form onSubmit={handleRegistrationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span>register form</span>
                    
                <label>
                    <span>login</span>
                    <input type='text' placeholder='login' ref={loginRef}/>
                </label>
                    
                <label>
                    <span>email</span>
                    <input type='email' placeholder='email' ref={emailRef}/>
                </label>

                <label>
                    <span>username</span>
                    <input type='text' placeholder='username' ref={usernameRef}/>
                </label>

                <label>
                    <span>password</span>
                    <input type='text' placeholder='password' ref={passwordRef}/>
                </label>

                <button type='submit'>
                    { isLoading ? 'loading...' : 'register' }
                </button>
            </form>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span>login form</span>
                    
                <label>
                    <span>login</span>
                    <input type='text' placeholder='loginLogin' ref={loginLoginRef}/>
                </label>

                <label>
                    <span>password</span>
                    <input type='text' placeholder='loginPassword' ref={loginPasswordRef}/>
                </label>

                <button type='submit'>
                    { isLoginLoading ? 'loading...' : 'login' }
                </button>
            </form>
        </>
    );
};


// const RegisterPage: FC = () => {
// const [registration, { isLoading }] = useUserRegistrationMutation();
// const { connected, eventEmitter } = useSocket();
// const loginRef = useRef<HTMLInputElement>(null);
// const emailRef = useRef<HTMLInputElement>(null);
// const usernameRef = useRef<HTMLInputElement>(null);
// const passwordRef = useRef<HTMLInputElement>(null);

//     console.log(connected);

//     const handleUpdate = async({ userId, username }: {userId: string, username: string}) => {
//         await fetch('http://localhost:5000/api/v1/user/update', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 userId,
//                 username,
//             }), 
//         });
//     };

// async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const data = {
//         login: loginRef.current?.value,
//         email: emailRef.current?.value,
//         username: usernameRef.current?.value,
//         password: passwordRef.current?.value,
//     };
//     // await registration(data);
//     console.log(data);
// }

//     return (
//         <>
//             <div>
// <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//     <span>register form</span>
                    
//     <label>
//         <span>login</span>
//         <input type='text' placeholder='login' ref={loginRef}/>
//     </label>
                    
//     <label>
//         <span>email</span>
//         <input type='email' placeholder='email' ref={emailRef}/>
//     </label>

//     <label>
//         <span>username</span>
//         <input type='text' placeholder='username' ref={usernameRef}/>
//     </label>

//     <label>
//         <span>password</span>
//         <input type='text' placeholder='password' ref={passwordRef}/>
//     </label>

//     <button type='submit'>
//         { isLoading ? 'loading...' : 'submit' }
//     </button>
// </form>
//             </div>
//         </>
//     );
// };