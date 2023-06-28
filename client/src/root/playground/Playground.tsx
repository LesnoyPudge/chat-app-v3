import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, RefContext, RefContextProvider, Button, ModalWindow, Memo, Static, Tooltip, OverlayItem, AnimatedTransition, OverlayPortal } from '@components';
import { animated, useInView, useSpring, useSpringValue } from '@react-spring/web';
import { Alignment, EncodedFile, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver, getEnv, getTransitionOptions } from '@utils';
import { Component, createContext, CSSProperties, FC, MutableRefObject, PropsWithChildren, PureComponent, ReactNode, RefObject, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Attachments, OpenEmojiPickerButton } from 'src/components/other/MessageInputBar/components';
import { useBoolean, useCounter, useEffectOnce, useElementSize, useHover, useImageOnLoad, useInterval, useIsFirstRender, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useSharedIntersectionObserver, useSharedResizeObserver, useTextInput, useThrottle, useWebWorker, useEventListener, useRelativePosition, useAnimationFrame, useRefWithSetter } from '@hooks';
import { ViewportList } from 'react-viewport-list';
import SimpleBarCore from 'simplebar-core';



interface ImageV2 extends PropsWithChildren {
    src?: string;
    file?: EncodedFile;
    alt?: string;
}

interface ImageState {
    loading: boolean;
    error: boolean;
}

const states = {
    loading: {
        loading: true,
        error: false,
    },
    error: {
        loading: false,
        error: true,
    },
    success: {
        loading: false,
        error: false,
    },
} satisfies Record<string, ImageState>;

const ImageV2: FC<ImageV2> = ({
    src,
    file,
    alt,
    children,
}) => {
    const [imageState, setImageState] = useState<ImageState>(states.loading);

    const handleLoad = () => {
        console.log('load');
        setImageState(states.success);
    };

    const handleError = () => {
        console.log('error');
        setImageState(states.error);
    };

    useEffect(() => {
        if (!src && !file) return;


    }, [src, file]);

    const withPlaceholder = !!children;

    return (
        <>
            <div>
                <>loading: {`${imageState.loading}`} error: {`${imageState.error}`}</>
            </div>
            
            <div>
                <picture>
                    {/* <source srcSet='image.avif' type='image/avif'/> */}
                    {/* <source srcSet='image.webp' type='image/webp'/> */}
                    {/* <source srcSet='large.png' media='(min-width: 1000px)'/> */}
                    {/* <source srcSet='medium.png 1x, large.png 2x' media='(min-width: 500px)'/> */}

                    <img
                        className={twClassNames(
                            'w-[600px] h-[600px] border-2 border-red-700 transition-all duration-200 mx-auto my-10 resize',
                            { 'opacity-0 pointer-events-none': imageState.loading },
                        )}
                        src='https://picsum.photos/400/200'
                        alt={alt}
                        loading='lazy'
                        decoding='async'
                        contentEditable='false'
                        draggable='false'
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                </picture>

                <Conditional isRendered={imageState.loading}>
                    <div className='absolute inset-0 bg-lime-500'>
                    </div>
                </Conditional>
            </div>
        </>
    );
};


import getScrollableParent from 'scrollparent';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { useLatest, useMeasure } from 'react-use';
import { useRelativePositionV2 } from 'src/hooks/useRelativePositionV2/useRelativePositionV2';
import { useFocus } from 'src/hooks/useFocus/useFocus';
import { Formik } from 'formik';
import { FormikFileUploadContextProvider } from '@libs';
import SimpleBar from 'simplebar-react';
// import { Chat } from 'src/components/other/Chat/Chat';
import { SingleEntryObserverCallback } from 'src/utils/observers/types';
import ReactFocusLock from 'react-focus-lock';
// import { useUserLoginMutation, useUserRegistrationMutation } from '@redux/features';



const PlaygroundInner3: FC = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <Scrollable className='h-full'>
                <RefContextProvider>
                    <div 
                        className='mt-80 bg-zinc-700' 
                        onClick={() => setIsActive((prev) => !prev)}
                    >
                        <>wow</>

                        <Conditional isRendered={isActive}>
                            <RelativelyPositionedV2>
                                
                            </RelativelyPositionedV2>
                        </Conditional>
                    </div>
                </RefContextProvider>

                <List list={Array(99).fill(null).map((_, i) => String(i))}>
                    {(item) => (
                        <div className='h-16'>
                            {item}
                        </div>
                    )}
                </List>
            </Scrollable>
        </>
    );
};

const workerFunction = (n: number) => {
    const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    };

    return fibonacci(n);
};

const workerFunction2 = (n: number) => {
    const memoizedFibonacci = (() => {
        const memo: { [key: number]: number } = {};
        return (n: number): number => {
            if (n in memo) return memo[n];
            if (n <= 1) return n;
            let fib = 1;
            let prevFib = 1;
            for (let i = 2; i < n; i++) {
                const temp = fib;
                fib += prevFib;
                prevFib = temp;
            }
            memo[n] = fib;
            return memo[n];
        };
    })();

    return memoizedFibonacci(n);
};

const PlaygroundInner4: FC = () => {
    const [runWorker, result] = useWebWorker(workerFunction2);
    const [number, setNumber] = useState(1);
    
    const handleClick = () => {
        runWorker(number);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(parseInt(event.target.value));
    };

    return (
        <div>
            <label>
                <>Calculate Fibonacci for:</>

                <input type='number' value={number} onChange={handleNumberChange} />
            </label>
            
            <button onClick={handleClick}>Calculate</button>

            {result.data && <p>The result is: {result.data}</p>}
            {result.error && <p>An error occurred: {result.error.message}</p>}
        </div>
    );
};

const PlaygroundInner5: FC = () => {
    const { count, increment } = useCounter(0);

    const [_, setTextareaRef] = useSharedResizeObserver(undefined, (entry) => {
        console.log('textarea resize');
    });
    
    const [__, setButtonRef] = useSharedResizeObserver(undefined, (entry) => {
        console.log('button resize');
    });

    const [___, setItemRef] = useSharedIntersectionObserver(undefined, (entry) => {
        console.log('int obs', entry.isIntersecting);
    });

    return (
        <div>
            <button onClick={increment} ref={setButtonRef}>
                {count}
            </button>

            <textarea 
                className='bg-lime-800 resize block'
                name='' 
                id=''
                value='wow'
                onChange={() => {}}
                ref={setTextareaRef}
            ></textarea>

            <Scrollable className='h-[500px]'>
                <div className='h-[900px]'>
                    <div ref={setItemRef}>
                        <>item</>
                    </div>
                </div>
            </Scrollable>
        </div>
    );
};

const PlaygroundInner6: FC = () => {
    const [list, setList] = useState(Array(19).fill(null).map(() => ''));

    const add = () => setList((prev) => [...prev, '']);

    useInterval(add, 500);

    const ListComponent = (
        <div className='flex flex-col gap-2'>
            {/* <List list={list}>
                
            </List> */}
            <ViewportList items={list}>
                {(_, i) => (
                    <div 
                        className='py-2'
                        onClick={add}
                        key={i}
                    >
                        <>item: {i}</>
                    </div>
                )}
            </ViewportList>
        </div>
    );

    return (
        <>
            <Conditional isRendered={true}>
                <div className='h-full relative flex'>
                    <Scrollable>
                        {ListComponent}
                    </Scrollable>
                </div>
            </Conditional>

            <Conditional isRendered={false}>
                <div className='h-full relative'>
                    <div className='absolute inset-0 overflow-y-scroll'>
                        {ListComponent}
                    </div>
                </div>
            </Conditional>

            {/* <Chat2 className='h-full'/> */}
        </>
    );
};

interface ContextValues {
    counter: number;
    inc: () => void;
    decr: () => void;
}

const PlaygroundContext = createContext<ContextValues | undefined>(undefined);

const Count: FC = () => {
    const { counter } = useContext(PlaygroundContext) as ContextValues;
    
    return (
        <div className='m-1'>
            {counter}
        </div>
    );
};

const Decr: FC = () => {
    const { decr } = useContext(PlaygroundContext) as ContextValues;
    
    return (
        <button className='m-1' onClick={decr}>
            <>decr</>
        </button>
    );
};

const Empty: FC = () => {
    return (
        <button className='m-1'>
            <>empty</>
        </button>
    );
};

const Inner: FC = () => {
    const { inc } = useContext(PlaygroundContext) as ContextValues;
    
    return (
        <>
            <Memo>
                <button className='m-1' onClick={inc}>
                    <>inc</>
                </button>
            </Memo>

            <Memo>
                <Empty/>
            </Memo>

            <Memo>
                <Count/>
            </Memo>
        </>
    );
};

const PlaygroundInner7: FC = () => {
    const { count, increment, decrement } = useCounter(0);

    const values: ContextValues = useMemo(() => ({
        counter: count,
        inc: increment,
        decr: decrement,
    }), [count]);

    return (
        <div className='flex flex-col gap-2'>
            <PlaygroundContext.Provider value={values}>
                <Memo>
                    <Decr/>
                </Memo>

                <Inner/>
            </PlaygroundContext.Provider>   
        </div>
    );
};

// const PlaygroundInner8: FC = () => {    
//     const apiRouteInput = useTextInput('');
//     const loginInput = useTextInput('');
//     const passwordInput = useTextInput('');


//     const sendRequest = (endpoint: string) => {
//         return fetch(`${getEnv().CUSTOM_SERVER_URL + getEnv().CUSTOM_API_V1_URL}/${endpoint}`, {
//             method: 'POST',
//             body: JSON.stringify({
//                 login: loginInput.value,
//                 password: passwordInput.value,
//             }),
//         });
//     };
//     const [login] = useUserLoginMutation();
//     const [registration] = useUserRegistrationMutation();

//     const handleClick = () => {
//         // sendRequest(apiRouteInput.value).then((value) => {
//         //     return value.json();
//         // })
        
//         registration({
//             login: loginInput.value,
//             password: passwordInput.value, 
//             username: 'some username',
//         }).then((value: any) => {
//             console.log(value);
//         }).catch((error) => {
//             console.log(`error: ${error}`);
//         });
//     };

//     return (
//         <div className='flex flex-col'>
//             <input 
//                 type='text' 
//                 value={apiRouteInput.value}
//                 onChange={apiRouteInput.handleChange}
//             />

//             <label>
//                 <>login</>
                
//                 <input 
//                     type='text' 
//                     value={loginInput.value}
//                     onChange={loginInput.handleChange}
//                 />
//             </label>

//             <label>
//                 <>password</>
            
//                 <input 
//                     type='text' 
//                     value={passwordInput.value}
//                     onChange={passwordInput.handleChange}
//                 />
//             </label>

//             <button onClick={handleClick}>
//                 send
//             </button>
//         </div>
//     );
// };

import { io, Socket } from 'socket.io-client';
import { audioBase } from './audioBase64';



class VoiceChatService {
    myId: string;
    socket: Socket;
    peerConnection: RTCPeerConnection | null;
    currentId: string | null;
    stunServers: string[] | null;
    iceCandidate: RTCIceCandidate | null;
    offer: {
        sdp: string | undefined;
        type: RTCSdpType;
    } | null;
    connections: {
        iceCandidate: RTCIceCandidateInit;
        offer: {
            sdp: string | undefined;
            type: RTCSdpType;
        }
    }[] | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    
    
    constructor(socket: Socket) {
        this.myId = String(Math.random());
        this.socket = socket;
        this.currentId = null;
        this.peerConnection = null;
        this.stunServers = null;
        this.iceCandidate = null;
        this.offer = null;
        this.connections = null;
        this.localStream = null;
        this.remoteStream = null;
    }

    async init() {
        console.log('init start');
        const url = 'https://raw.githubusercontent.com/pradt2/always-online-stun/master/valid_hosts.txt';
        const stunServersResponse = await fetch(url).catch((e) => console.log(e));
        if (!stunServersResponse) return;

        const stunServersText = await stunServersResponse.text();
        this.stunServers = stunServersText.split('\n').filter(Boolean).map((server) => {
            return `stun:${server}`;
        });

        this.peerConnection = new RTCPeerConnection({
            iceCandidatePoolSize: 10,
            iceServers: [{ urls: this.stunServers.slice(0, 3) }],
        });

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
        if (!stream) return;

        this.localStream = stream;
        this.remoteStream = new MediaStream();

        const audio = new Audio();
        audio.autoplay = true;
        audio.srcObject = this.remoteStream;
    

        // const audio2 = new Audio();
        // audio2.autoplay = true;
        // audio2.srcObject = this.localStream;

        this.localStream.getTracks().forEach((track) => {
            if (!this.peerConnection || !this.localStream) return;
            
            this.peerConnection.addTrack(track, this.localStream);
        });

        this.peerConnection.ontrack = (event) => {
            console.log('on track', event.streams);
            
            event.streams[0].getTracks().forEach((track) => {
                if (!this.remoteStream) return;

                this.remoteStream.addTrack(track);
                this.peerConnection?.addTrack(track, event.streams[0]);
            });
        };

        this.peerConnection.onicecandidate = (event) => {
            if (!event.candidate) return;
            console.log('on ice', event.candidate);
            this.iceCandidate = event.candidate;
        };

        const offerDescription = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offerDescription);
        

        this.offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        console.log('init finish');
    }

    async join(voiceChatId: string) {
        console.log('join start', this.peerConnection, this.iceCandidate, this.offer, this.stunServers?.at(0));
        if (voiceChatId === this.currentId) return;
        if (
            !this.peerConnection ||
            !this.iceCandidate ||
            !this.offer ||
            !this.stunServers ||
            !this.localStream ||
            !this.remoteStream
        ) return;

        // const audio = new Audio();
        // audio.autoplay = true;
        // audio.src = audioBase;

        // setTimeout(() => {
        //     const audio2 = new Audio();
        //     audio2.autoplay = true;
        //     audio2.src = audioBase;
        // }, 500);
        // audio.play();

        console.log('get in join');
        
        // const localAudio = document.createElement('audio');
        // localAudio.autoplay = true;
        // localAudio.srcObject = this.localStream;
        // document.body.appendChild(localAudio);

        // const remoteAudio = document.createElement('audio');
        // remoteAudio.autoplay = true;
        // remoteAudio.srcObject = this.remoteStream;
        // document.body.appendChild(remoteAudio);

        this.currentId = voiceChatId;

        console.log('my id is:', this.myId);
        this.socket.emit('VoiceChat_join', {
            myId: this.myId,
            iceCandidate: this.iceCandidate.toJSON(),
            offer: this.offer,
        });

        this.socket.on('VoiceChat_data', (
            connections: {
                myId: string;
                iceCandidate: RTCIceCandidateInit;
                offer: {
                    sdp: string | undefined;
                    type: RTCSdpType;
                }
            }[],
        ) => {
            console.log('get connect', connections);

            connections.forEach((connection) => {
                if (connection.myId === this.myId) return;
                const answerDescription = new RTCSessionDescription(connection.offer);
                this.peerConnection?.setRemoteDescription(answerDescription);
    
                const candidate = new RTCIceCandidate(connection.iceCandidate);
                this.peerConnection?.addIceCandidate(candidate);

                

            });
            
            this.connections = connections;
        });

        
        console.log('join end');
    }

    leave() {
        this.currentId = null;
        this.socket.removeAllListeners();
    }
}

// const socket = io('ws://localhost:5000', { autoConnect: true, auth: { id: '648835dfc82aa7e61fd0f39f' } });

// const voiceChatService = new VoiceChatService(socket);

// await voiceChatService.init();

// setTimeout(() => {
//     voiceChatService.join('asd');
// }, 3000);

// socket.on('connect', () => {
//     console.log(`event: connect | session id: ${socket.id}`);
// });

// socket.on('connect_error', (err) => {
//     console.log(`event: connect_error | reason: ${err.message}`);
// });

// socket.on('disconnect', (reason) => {   
//     console.log(`event: disconnect | reason: ${reason}`);
// });

// socket.onAny((event, ...args) => {
//     console.log(`any event: ${event} | arguments: ${args}`);
// });

// let accessToken: string | undefined = undefined;

// const PlaygroundInner9: FC = () => {
//     const socketRef = useRef(io('ws://localhost:5000', { 
//         autoConnect: false, 
//         auth: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODgzNWRmYzgyYWE3ZTYxZmQwZjM5ZiIsImVtYWlsIjpudWxsLCJwYXNzd29yZCI6IiQyYiQxMCRrckJGM3NpSk5EM2JpMUZMU1VKc2hlbWx0VS5vbTRHTUg0empNZmZYTENrdUxkNkpveHhPTyIsImlhdCI6MTY4NjY1OTY3OCwiZXhwIjoxNjg2NjYwNTc4fQ.jW1ZgxAz46YuER_Voxu6Iv8cmi2FtPLl_8T3IY_15_k' }, 
//     }));

//     useEffect(() => {
//         const socket = socketRef.current;

//         socket.on('connect', () => {
//             console.log(`event: connect | session id: ${socket.id}`);
//         });
        
//         socket.on('connect_error', (err) => {
//             console.log(`event: connect_error | reason: ${err.message}`);
//         });
        
//         socket.on('disconnect', (reason) => {   
//             console.log(`event: disconnect | reason: ${reason}`);
//         });
        
//         socket.onAny((event, ...args) => {
//             console.log(`any event: ${event} | arguments: ${args}`);
//         });
//     }, []);

//     const handleConnect = () => {
//         // accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODgzNWRmYzgyYWE3ZTYxZmQwZjM5ZiIsImVtYWlsIjpudWxsLCJwYXNzd29yZCI6IiQyYiQxMCRrckJGM3NpSk5EM2JpMUZMU1VKc2hlbWx0VS5vbTRHTUg0empNZmZYTENrdUxkNkpveHhPTyIsImlhdCI6MTY4NjY0ODg2NywiZXhwIjoxNjg2NjQ5NzY3fQ.Ie96daceBTs-fVUu7XQmdzaHbnXp8YL8S4P9O6yz-d0';
//         socketRef.current.connect();
//         console.log('should open');
//     };

//     const handleDisconnect = () => {
//         accessToken = undefined;
//         socketRef.current.disconnect();
//         console.log('should close');
//     };

//     const handleSome = () => {
//         socketRef.current.emit('some', 'hello');
//     };

//     return (
//         <div className='flex gap-6 font-bold text-3xl [&>*]:bg-gray-700 [&>*]:p-4'>
//             <button onClick={handleConnect}>
//                 <>conn</>
//             </button>

//             <button onClick={handleDisconnect}>
//                 <>disc</>
//             </button>

//             <button onClick={handleSome}>
//                 <>some</>
//             </button>
//         </div>
//     );
// };


// const peerConnection = new RTCPeerConnection({
//     iceServers: [{ urls: ['stun:stun3.l.google.com:19302', 'stun:stun1.l.google.com:19305'] }],
//     iceCandidatePoolSize: 10,
// });

// const streams: {
//     local: MediaStream | null;
//     remote: MediaStream | null;
// } = {
//     local: null,
//     remote: null,
// };

// const PlaygroundInner10: FC = () => {
//     const [mediaTracks, setMediaTracks] = useState<MediaStreamTrack[]>([]);
//     const audioRef = useRef<HTMLAudioElement>(null);
//     const audioRef2 = useRef<HTMLAudioElement>(null);

//     const handleStartCall = async() => {
//         voiceChatService.join('asd');
     
//         // streams.local = await navigator.mediaDevices.getUserMedia({ audio: true });
//         // streams.remote = new MediaStream();

//         // streams.local.getTracks().forEach((track) => {
//         //     if (!streams.local) return;
//         //     peerConnection.addTrack(track, streams.local);
//         // });

//         // peerConnection.ontrack = (event) => {
//         //     event.streams[0].getTracks().forEach((track) => {
//         //         if (!streams.remote) return;
//         //         streams.remote.addTrack(track);
//         //     });
//         // };

//         // if (!audioRef.current || !audioRef2.current) return;

//         // audioRef.current.srcObject = streams.local;
//         // audioRef2.current.srcObject = streams.remote;

//         // peerConnection.onicecandidate = (event) => {
//         //     event.candidate && socket.emit('VoiceChat_candidate', event.candidate.toJSON());
//         // };

//         // const offerDescription = await peerConnection.createOffer();
//         // await peerConnection.setLocalDescription(offerDescription);

//         // const offer = {
//         //     sdp: offerDescription.sdp,
//         //     type: offerDescription.type,
//         // };
//         // console.log(offer);
//         // socket.emit('VoiceChat_offer', offer);

//         // socket.on('VoiceChat_answer', (answer) => {
//         //     if (!peerConnection.currentRemoteDescription && answer?.answer) {
//         //         const answDesc = new RTCSessionDescription(answer.answer);
//         //         peerConnection.setRemoteDescription(answDesc);
//         //     }
//         // });
        
//     };

//     const handleEndCall = () => {
//         voiceChatService.leave();
//     };

//     return (
//         <>
//             <div className='grid gap-2 p-11'>
//                 <div>
//                     <>status: {}</>
//                 </div>

//                 <audio
//                     ref={audioRef}
//                     controls 
//                     autoPlay
//                 ></audio>

//                 <audio
//                     ref={audioRef2}
//                     controls 
//                     autoPlay
//                 ></audio>

//                 <button onClick={handleStartCall}>
//                     <>start call</>
//                 </button>

//                 <button onClick={handleEndCall}>
//                     <>end call</>
//                 </button>
//             </div>
//         </>
//     );
// };

import { Peer } from 'peerjs';



const peer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/api/v1/peer',
    // debug: 3,
    debug: 0,
});

const socket = io('ws://localhost:5000', { autoConnect: false, auth: { id: '648835dfc82aa7e61fd0f39f' } });

let peerId: string | null = null;

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    peerId = id;
});

const getMediaStream = (() => {
    let myMediaStream: MediaStream | null = null;
    
    return async(): Promise<MediaStream> => {
        if (myMediaStream === null) {
            myMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return myMediaStream;
        }

        return myMediaStream;
    };
})();

const createAudio = (stream: MediaStream) => {
    console.log('creating audio', [stream]);
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.srcObject = stream;
    audio.controls = true;
    audio.dataset.who = 'on call';
                
    document.querySelector('.container')?.appendChild(audio);
    console.log(document.querySelector('.container'));
};

peer.on('call', (call) => {
    getMediaStream().then((stream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (receivedRemoteStream) => {
            // Show stream in some <video> element.
            console.log('got stream in CALL', receivedRemoteStream);
    
            createAudio(receivedRemoteStream);
        });
    });
});

let connections: string[] = [];

socket.on('VoiceChat_data', (peers: string[]) => {
    console.log('get connect', peers);
    if (!peers.length) return;

    connections = peers.filter((id) => id !== peerId);
});


const useConversation = (conversationId: string) => {
    
};


const PlaygroundInner11: FC = () => {

    const handleJoin = () => {
        console.log('join to voice chat', peerId);
        socket.emit('VoiceChat_join', peerId);
    };

    const handleCall = async() => {
        if (!connections.length) return;

        getMediaStream().then((stream) => {
            connections.forEach((recivedPeerId) => {
                if (recivedPeerId === peerId) return;
    
                const call = peer.call(recivedPeerId, stream);
                
                call.on('stream', (receivedStream) => {
                    createAudio(receivedStream);
                });
            });
        });
    };

    const handleLeave = () => {
        console.log('leave click');
    };
    
    return (
        <div className='flex flex-col gap-4 p-4'>
            <button onClick={handleJoin}>join</button>

            <button onClick={handleCall}>call</button>

            <button onClick={handleLeave}>leave</button>

            <div className='container'>

            </div>
        </div>
    );
};

const RelativelyPositionedV2: FC<PropsWithChildren> = ({ children }) => {
    const absoluteElementRef = useRef<HTMLDivElement | null>(null);
    const { targetRef: relativeElementRef } = useContext(RefContext) as RefContext;
    const { alignment, isRelativeInView } = useRelativePositionV2({
        preferredAlignment: 'top',
        relativeElementRef,
        absoluteElementRef,
        swappableAlignment: true,
        centered: true,
        spacing: 20,
    });

    return (
        <div className='fixed z-10' ref={absoluteElementRef}>
            {children} {alignment}
        </div>
    );
};


import { AnyArray, IsNever, Primitive, AnyFunction, Tuple, Prettify, ToType, StrictExtract } from '@shared';
import isCallable from 'is-callable';
import { AnyRecord } from 'ts-essentials/dist/any-record';



// type PropsWithChildrenAsNodeOrFunctionV3<
//     T extends Record<string | number, unknown> | AnyArray
// > = {
//     children?: ReactNode | (
//         T extends Record<string | number, unknown> 
//             ? ((arg: T) => ReactNode)
//             : T extends AnyArray
//                 ? ((...args: T) => ReactNode)
//                 : never
//     );
// }

// type ChildrenAsNodeOrFunctionV3<
//     T extends Record<string | number, unknown> | AnyArray
// > = PropsWithChildrenAsNodeOrFunctionV3<T> & {
//     args: Readonly<T>;
// };

// const ChildrenAsNodeOrFunctionV3 = <T extends Record<string | number, unknown> & object | AnyArray,>({
//     args,
//     children,
// }: ChildrenAsNodeOrFunctionV3<T>) => {
//     const childrenNode = (
//         isCallable(children) 
//             ? Array.isArray(args) 
//                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                 // @ts-ignore
//                 ? children(...args)
//                 : children(args) 
//             : children
//     );
    
//     return (
//         <>
//             {childrenNode}
//         </>
//     );
// };
// Record<string | number, unknown>
// ToType





// line = line.replace('interface', 'type');
// return lines.join('\n')

interface WithAlignment {
    alignment: Alignment;
}

interface Position {
    top: number;
    left: number;
}
interface Options {
    preferredAlignment: Alignment;
    swappableAlignment?: boolean;
    boundsSize?: number;
    spacing?: number;
    centered?: boolean;
}

interface WithRects {
    followerRect: DOMRect;
    leaderRect: DOMRect;
}

interface UseRelativePositionArgs extends Options {
    followerRef: RefObject<HTMLElement>;
    leaderRef: RefObject<HTMLElement>;
}

const useRelativePositionV3 = ({
    preferredAlignment,
    followerRef,
    leaderRef,
    swappableAlignment = false,
    boundsSize = 0,
    spacing = 0,
    centered = false,
}: UseRelativePositionArgs): WithAlignment => {
    const [alignment, setAlignment] = useState(preferredAlignment);
    const isFirstRender = useIsFirstRender();

    const calculate = useCallback(() => {
        if (!followerRef.current || !leaderRef.current) return;
        
        const { alignment: newAlignment, left, top } = calculateRelativePosition({
            followerRect: followerRef.current.getBoundingClientRect(),
            leaderRect: leaderRef.current.getBoundingClientRect(),
            boundsSize,
            centered,
            preferredAlignment,
            spacing,
            swappableAlignment,
        });

        if (alignment !== newAlignment) setAlignment(newAlignment);

        const follower = followerRef.current;
        if (follower.style.top === `${top}px` && follower.style.left === `${left}px`) return;
  
        follower.style.top = `${top}px`;
        follower.style.left = `${left}px`;
    }, [
        alignment, boundsSize, centered, 
        followerRef, leaderRef, preferredAlignment, 
        spacing, swappableAlignment,
    ]);

    useLayoutEffect(() => {
        if (isFirstRender) calculate();
    }, [isFirstRender, calculate]);

    useAnimationFrame(calculate);
    
    return {
        alignment,
    };
};

const calculateRelativePosition = ({
    followerRect,
    leaderRect,
    preferredAlignment,
    boundsSize,
    centered,
    spacing,
    swappableAlignment,
}: Required<Options> & WithRects): Position & WithAlignment => {
    const centering = {
        vertical: (
            centered 
                ? (followerRect.height - leaderRect.height) / 2 
                : 0
        ),
        horizontal: (
            centered 
                ? (followerRect.width - leaderRect.width) / 2 
                : 0
        ),
    };

    const bounds = {
        top: boundsSize,
        bottom: window.innerHeight - boundsSize - followerRect.height,
        left: boundsSize,
        right: window.innerWidth - boundsSize - followerRect.width,
    };

    const unboundedPositions = {
        top: {
            top: leaderRect.top - followerRect.height - spacing,
            left: leaderRect.left - centering.horizontal,
        },
        bottom: {
            top: leaderRect.bottom + spacing,
            left: leaderRect.left - centering.horizontal,
        },
        left: {
            top: leaderRect.top - centering.vertical,
            left: leaderRect.left - followerRect.width - spacing,
        },
        right: {
            top: leaderRect.top - centering.vertical,
            left: leaderRect.right + spacing,
        },
    };

    const positionsInBounds = () => {
        const { top, bottom, left, right } = unboundedPositions;

        return {
            top: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, top.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, top.left)),
            },
            bottom: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, bottom.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, bottom.left)),
            },
            left: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, left.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, left.left)),
            },
            right: {
                top: Math.max(bounds.top, Math.min(bounds.bottom, right.top)),
                left: Math.max(bounds.left, Math.min(bounds.right, right.left)),
            },
        };
    };

    const getAvailableAlignments = () => {
        return {
            top: unboundedPositions.top.top > bounds.top,
            bottom: unboundedPositions.bottom.top < bounds.bottom,
            left: unboundedPositions.left.left > bounds.left,
            right: unboundedPositions.right.left < bounds.right,
        };
    };

    const positions = positionsInBounds();
    
    const defaultResult: Position & WithAlignment = {
        ...positions[preferredAlignment],
        alignment: preferredAlignment,
    };

    if (!swappableAlignment) return defaultResult;

    const availableAlignments = getAvailableAlignments();

    if (availableAlignments[preferredAlignment]) return defaultResult;

    const noSpaceAvailable = (
        !availableAlignments.top && 
        !availableAlignments.bottom && 
        !availableAlignments.left && 
        !availableAlignments.right
    );

    if (noSpaceAvailable) return defaultResult;

    const topResult: Position & WithAlignment = {
        alignment: 'top',
        ...positions.top,
    };
    const bottomResult: Position & WithAlignment = {
        alignment: 'bottom',
        ...positions.bottom,
    };
    const leftResult: Position & WithAlignment = {
        alignment: 'left',
        ...positions.left,
    };
    const rightResult: Position & WithAlignment = {
        alignment: 'right',
        ...positions.right,
    };
    
    const alternativeAlignmentOptions = {
        top: (
            (availableAlignments.bottom && bottomResult) || 
            (availableAlignments.left && leftResult) || 
            (availableAlignments.right && rightResult) || 
            topResult
        ),
        bottom: (
            (availableAlignments.top && topResult) ||
            (availableAlignments.left && leftResult) || 
            (availableAlignments.right && rightResult) || 
            bottomResult
        ),
        left: (
            (availableAlignments.right && rightResult) ||
            (availableAlignments.top && topResult) || 
            (availableAlignments.bottom && bottomResult) || 
            leftResult
        ),
        right: (
            (availableAlignments.left && leftResult) ||
            (availableAlignments.top && topResult) || 
            (availableAlignments.bottom && bottomResult) || 
            rightResult
        ),
    };

    return alternativeAlignmentOptions[preferredAlignment];
};

type RelativelyPositionedV3 = PropsWithChildrenAsNodeOrFunction<WithAlignment>;

const RelativelyPositionedV3: FC<RelativelyPositionedV3> = ({ children }) => {
    const followerRef = useRef<HTMLDivElement>(null);
    const { targetRef: leaderRef } = useContext(RefContext) as RefContext;
    const { alignment } = useRelativePositionV3({
        preferredAlignment: 'top',
        followerRef,
        leaderRef,
        swappableAlignment: true,
        centered: true,
        spacing: 20,
    });

    const childrenArgs: WithAlignment = {
        alignment,
    };
    
    return (
        <div className='fixed' ref={followerRef}>
            <ChildrenAsNodeOrFunction args={childrenArgs}>
                {children}
            </ChildrenAsNodeOrFunction>
        </div>
    );
};

const transitionOptions = getTransitionOptions.withOpacity({
    from: {
        offset: 15,
    },
    enter: {
        offset: 0,
    },
    leave: {
        offset: 15,
    },
    config: {
        duration: 150,
    },
});

const styles = {
    base: `bg-primary-500 text-color-base font-bold py-[5px] px-2.5 
    rounded-md w-max max-w-[300px] shadow-elevation-low`,
};

const TooltipV2: FC<PropsWithChildren> = ({ children }) => {
    const { targetRef } = useContext(RefContext) as RefContext;
    const [isExist, setIsExist] = useState(false);
    const [withKeyboardRef, setWithKeyboard] = useRefWithSetter(false);
    const [withMouseRef, setWithMouse] = useRefWithSetter(false);

    const changeState = () => {
        const newState = withKeyboardRef.current || withMouseRef.current;
        if (newState === isExist) return;

        setIsExist(newState);
    };

    const handleFocusIn = (e: FocusEvent) => {
        if (e.target !== targetRef.current) return;

        setWithKeyboard(true);
        changeState();
    };
    
    const handleFocusOut = (e: FocusEvent) => {
        if (e.target !== targetRef.current) return;
        
        setWithKeyboard(false);
        changeState();
    };
    
    const handleMouseEnter = () => {
        setWithMouse(true);
        changeState();
    };

    const handleMouseLeave = () => {
        setWithMouse(false);
        changeState();
    };

    useEventListener('focusin', handleFocusIn, targetRef);
    useEventListener('focusout', handleFocusOut, targetRef);
    useEventListener('mouseenter', handleMouseEnter, targetRef);
    useEventListener('mouseleave', handleMouseLeave, targetRef);

    useSharedIntersectionObserver(targetRef, ({ isIntersecting }) => {
        if (isIntersecting === isExist) return;

        setWithKeyboard(isIntersecting);
        setWithMouse(isIntersecting);
        setIsExist(isIntersecting);
    });

    return (
        <AnimatedTransition
            isExist={isExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <Conditional isRendered={isAnimatedExist}>
                    <OverlayPortal>
                        <div className='overlay-item-wrapper'>
                            <RelativelyPositionedV3>
                                {({ alignment }) => {
                                    const alignmentStyles = {
                                        top: {
                                            translateY: style.offset.to((offset => `-${offset}px`)),
                                        },
                                        bottom: {
                                            translateY: style.offset.to((offset) => `${offset}px`),
                                        },
                                        left: {
                                            translateX: style.offset.to((offset) => `-${offset}px`),
                                        },
                                        right: {
                                            translateX: style.offset.to((offset) => `${offset}px`),
                                        },
                                    };
    
                                    const styleWithOffset = {
                                        opacity: style.opacity,
                                        ...alignmentStyles[alignment],
                                    };
      
                                    return (
                                        <animated.div 
                                            className={twClassNames(styles.base)}
                                            style={styleWithOffset}
                                            role='tooltip'
                                        >
                                            {children}
                                        </animated.div>
                                    );
                                }}
                            </RelativelyPositionedV3>
                        </div>
                    </OverlayPortal>
                </Conditional>
            )}
        </AnimatedTransition>
    );
};

const PlaygroundInner12: FC = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const thirdbRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (!thirdbRef.current) return;
            
            // thirdbRef.current.style.top = `${e.clientY}px`;
            // thirdbRef.current.style.left = `${e.clientX}px`;
        };

        document.addEventListener('mousemove', handle);
        
        return () => {
            document.removeEventListener('mousemove', handle);
        };
    }, []);

    const { x } = useSpring({
        from: { x: 0 },
        to: { x: 0 },
        config: { duration: 2000 },
        reset: true,
        loop: true,
    });

    return (
        <div>
            <Scrollable followContentSize className='max-h-36'>
                <div 
                    className='flex flex-col gap-20 bg-slate-700 p-20' 
                    ref={wrapperRef}
                >
                    <List list={Array(20).fill('')}>
                        {() => (
                            <br />
                        )}
                    </List>

                    <RefContextProvider>
                        <animated.button 
                            className='mx-auto bg-brand p-2 rounded'
                            style={{
                                translateX: x.to((value) => {
                                    return `${value}px`;
                                }),
                                translateY: x.to((value) => {
                                    return `${value}px`;
                                }),
                            }}
                        >
                            <>first button</>
                        </animated.button>

                        <Tooltip preferredAlignment='right'>
                            <>tooltip</>
                        </Tooltip>
                    </RefContextProvider>

                    <RefContextProvider>
                        <animated.button 
                            className='mx-auto bg-brand p-2 rounded'
                            style={{
                                translateX: x.to((value) => {
                                    return `${value}px`;
                                }),
                                translateY: x.to((value) => {
                                    return `${value}px`;
                                }),
                            }}
                        >
                            <>second button</>
                        </animated.button>

                        <TooltipV2>
                            <>TooltipV2</>
                        </TooltipV2>
                    </RefContextProvider>

                    <RefContextProvider>
                        <animated.button 
                            className='fixed mx-auto bg-brand p-2 rounded'
                            ref={thirdbRef}
                        >
                            <>third button</>
                        </animated.button>

                        <Conditional isRendered={false}>
                            <RelativelyPositionedV3>
                                <>RelativelyPositionedV3 2</>
                            </RelativelyPositionedV3>
                        </Conditional>
                    </RefContextProvider>

                    <List list={Array(20).fill('')}>
                        {() => (
                            <br />
                        )}
                    </List>
                </div>
            </Scrollable>
        </div>
    );
};

const enabled = !!1;

export const Playground: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Conditional isRendered={!enabled}>
                {children}
            </Conditional>

            <Conditional isRendered={enabled}>
                <ReactFocusLock>
                    {/* <PlaygroundInner/> */}
                    {/* <PlaygroundInner2/> */}
                    {/* <PlaygroundInner3/> */}
                    {/* <PlaygroundInner4/> */}
                    {/* <PlaygroundInner5/> */}
                    {/* <PlaygroundInner6/> */}
                    {/* <PlaygroundInner7/> */}
                    {/* <PlaygroundInner8/> */}
                    {/* <PlaygroundInner9/> */}
                    {/* <PlaygroundInner10/> */}
                    {/* <PlaygroundInner11/> */}
                    <PlaygroundInner12/>
                </ReactFocusLock>
            </Conditional>
        </>
    );
};