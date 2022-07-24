import { FC, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useWebRTC } from 'src/hooks';
import { logout, selectUserInfo, useUserLogoutMutation, useUserSomeMutation, useUserUpdateMutation } from 'src/redux/features';
import { socket } from 'src/utils';



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

    const { streams, getMediaDevicesPermission } = useWebRTC();
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const hangUpCall = () => {
        console.log('hand up call');
    };

    const call = () => {
        console.log('call');
    };
    const user = useAppSelector(selectUserInfo);
    useEffect(() => {
        socket().emitters.user.joinRooms('123');
        socket().emitters.user.connectToVoiceRoom({ userId: user.id });
    }, [user.id]);

    useEffect(() => {
        getMediaDevicesPermission().catch((e) => console.log(e));
    }, [getMediaDevicesPermission]);

    // useEffect(() => {
    //     if (!videoRef.current) return;
    //     const video = videoRef.current;

    //     const getPermission = async() => {
    //         const stream = await getMediaDevicesPermission();
    //         return stream;
    //     };

    //     getPermission().then((stream) => {
    //         video.srcObject = stream;
    //     });
        
    // }, [getMediaDevicesPermission]);

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

            <div>
                {
                    streams.map((item) => {
                        return (
                            <Video stream={item} key={item.id}/>
                        );
                    })
                }
            </div>
            

            {/* <UserInfo targetId='62d3ad0e6736eef593b901e5'/>

            <br />

            <UserInfo targetId='62d79d7b3cb7e0d9835e02e0'/> */}

            <Outlet/>
        </>
    );
};


interface IVideo {
    stream: {
        id: string,
        stream: MediaStream,
    }
}

const Video: FC<IVideo> = ({ stream }) => {
    const user = useAppSelector(selectUserInfo);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isMuted = stream.id === user.id;

    useEffect(() => {
        if (!videoRef.current) return;

        videoRef.current.srcObject = stream.stream;
    }, [stream.stream]);

    return (
        <>
            <video autoPlay ref={videoRef} muted={isMuted}></video>
        </>
    );
};