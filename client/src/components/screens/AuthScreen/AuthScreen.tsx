import { FC, useRef } from 'react';
import { useUserLoginMutation, useUserRegistrationMutation } from 'src/redux/features';



export const AuthScreen: FC = () => {
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