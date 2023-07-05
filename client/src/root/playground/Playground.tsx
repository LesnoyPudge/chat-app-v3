import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, Button, ModalWindow, Memo, Static, Tooltip, OverlayItem, AnimatedTransition, OverlayPortal, ContextMenu , OverlayContext, RelativelyPositioned } from '@components';
import { animated, useInView, useSpring, useSpringValue } from '@react-spring/web';
import { Alignment, EncodedFile, OmittedRect, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver, getEnv, getTransitionOptions } from '@utils';
import { Component, createContext, CSSProperties, FC, Fragment, MutableRefObject, PropsWithChildren, PropsWithRef, PureComponent, ReactNode, RefObject, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useBoolean, useCounter, useEffectOnce, useElementSize, useHover, useImageOnLoad, useInterval, useIsFirstRender, useTimeout, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useSharedIntersectionObserver, useSharedResizeObserver, useTextInput, useThrottle, useWebWorker, useEventListener, useRelativePosition, useAnimationFrame, useRefWithSetter, useProvidedValue, useStateAndRef, UseRelativePositionArgs } from '@hooks';
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
                        src='https://i.pravatar.cc/400/200'
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
import { useFocus } from 'src/hooks/useFocus/useFocus';
import { Form, Formik, useField, useFormikContext } from 'formik';
import { FormikFileUploadContextProvider } from '@libs';
import SimpleBar from 'simplebar-react';
// import { Chat } from 'src/components/other/Chat/Chat';
import { SingleEntryObserverCallback } from 'src/utils/observers/types';
import ReactFocusLock from 'react-focus-lock';
// import { useUserLoginMutation, useUserRegistrationMutation } from '@redux/features';
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

import imagesrc from '@assets/wallpaperflare.com_wallpaper.jpg';
import { AnyRecord } from 'ts-essentials/dist/any-record';




const LocalImage: FC = () => {
    return (
        <>
            <div className='relative w-1/2 h-3/4 bg-lime-600'>
                <picture className=''>
                    <source srcSet={imagesrc} className='' type='image/jpg'/>
                    {/* <img src={imagesrc} className='absolute object-cover inset-0'/> */}
                </picture>
            </div>
            {/* <img src={imagesrc} className='w-1/2 h-3/4'/> */}
            
        </>
    );
};

type ChildrenArgs<FormValues, Name> = ReturnType<typeof useField<FormValues[Name]>>;

const FormikField = <FormValues extends AnyRecord>({
    name,
    children,
}: {name: keyof FormValues} & PropsWithChildrenAsNodeOrFunction<ChildrenArgs<FormValues, keyof FormValues>>) => {
    const [inputProps, metaProps, helperProps] = useField<FormValues[typeof name]>(String(name));
    const { getFieldMeta } = useFormikContext<FormValues>();
    const childrenArgs: ChildrenArgs<FormValues, keyof FormValues> = [inputProps, metaProps, helperProps]; 
    const qwe = getFieldMeta<FormValues[typeof name]>(String(name));
    
    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};

interface SomeForm {
    username: string;
    cool: boolean;
    union: 'some' | 'data';
}

const PlaygroundInner16: FC = () => {
    return (
        <div className='flex flex-col gap-2 h-screen'>
            {/* <Image 
                placeholder={<div className='bg-red-700'>qwe</div>} 
                src='https://images.placeholders.dev'
            /> */}

            <LocalImage/>

            {/* <ImageV2 src='https://images.placeholders.dev'/> */}
        </div>
    );
};

const initialValues: SomeForm = {
    username: 'dick',
    cool: false,
    union: 'some',
};

const PlaygroundInner17: FC = () => {
    return (
        <Formik initialValues={initialValues} onSubmit={(v) => console.log(v)}>
            <Form>
                <FormikField<SomeForm> name='username'>
                    {(o, t, th) => (
                        <div className='grid gap-20'>
                            <div>
                                <>{JSON.stringify(o)}</>
                            </div>

                            <div>
                                <>{JSON.stringify(t)}</>
                            </div>

                            <div>
                                <>{JSON.stringify(th)}</>
                            </div>
                        </div>
                    )}
                </FormikField>

                <FormikField<SomeForm> name='union'>
                    {({ value }) => (
                        <>
                            {value}
                        </>
                    )}
                </FormikField>
            </Form>
        </Formik>
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
                    {/* <PlaygroundInner12/> */}
                    {/* <PlaygroundInner13/> */}
                    {/* <PlaygroundInner14/> */}
                    {/* <PlaygroundInner15/> */}
                    {/* <PlaygroundInner16/> */}
                    <PlaygroundInner17/>
                </ReactFocusLock>
            </Conditional>
        </>
    );
};