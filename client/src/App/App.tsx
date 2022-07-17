import React, { FC, useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { useUserRegistrationMutation } from 'src/redux/features';
import { useSocket } from '../hooks';



export const App: FC = () => {


    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Outlet/>}>
                    <Route path='auth' element={<>authPage</>}/>

                    <Route path='app' element={<>no match</>}>
                        <Route path='overview' element={<>overview page</>}>
                            <Route index element={<>friend page</>}/>
                            <Route path='privateChat/:targetId' element={<>private chat page</>}/>
                        </Route>

                        <Route path='channel/:channelId' element={<>channel page</>}>
                            <Route path='room/:roomId' element={<>roomPage</>}/>
                        </Route>

                        <Route path='*' element={<>no match</>}/>
                    </Route>

                    <Route path='invitation/:invitationLink' element={<>invitation page</>}/>
                    <Route path='accoutnActivation/:activationLink' element={<>activation page</>}/>

                    <Route path='*' element={<>no match</>}/>
                </Route>
                
            </Routes>
        </BrowserRouter>
    );
};



const RegisterPage: FC = () => {
    const [registration, { isLoading }] = useUserRegistrationMutation();
    const { connected, eventEmitter } = useSocket();
    const loginRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    console.log(connected);

    const handleUpdate = async({ userId, username }: {userId: string, username: string}) => {
        await fetch('http://localhost:5000/api/v1/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                username,
            }), 
        });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const data = {
            login: loginRef.current?.value,
            email: emailRef.current?.value,
            username: usernameRef.current?.value,
            password: passwordRef.current?.value,
        };
        await registration(data);
        console.log(data);
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        { isLoading ? 'loading...' : 'submit' }
                    </button>
                </form>
            </div>
        </>
    );
};