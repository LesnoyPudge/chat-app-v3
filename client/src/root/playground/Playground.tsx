import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, Button, ModalWindow, Memo, Static, Tooltip, OverlayItem, AnimatedTransition, OverlayPortal, ContextMenu , OverlayContext, RelativelyPositioned, CheckBox, RadioInput, TextInput, Icon, Space, Ref } from '@components';
import { animated, useInView, useSpring, useSpringValue } from '@react-spring/web';
import { Alignment, EncodedFile, OmittedRect, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver, getEnv, getTransitionOptions } from '@utils';
import React, { Component, createContext, CSSProperties, FC, Fragment, MutableRefObject, PropsWithChildren, PropsWithRef, PureComponent, ReactNode, RefObject, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useBoolean, useCounter, useEffectOnce, useElementSize, useHover, useImageOnLoad, useInterval, useIsFirstRender, useTimeout, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useSharedIntersectionObserver, useSharedResizeObserver, useTextInput, useThrottle, useWebWorker, useEventListener, useRelativePosition, useAnimationFrame, useRefWithSetter, useProvidedValue, useStateAndRef, UseRelativePositionArgs, useSet } from '@hooks';
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
                <>
loading:
                    {' '}
                    {`${imageState.loading}`}
                    {' '}
error:
                    {' '}
                    {`${imageState.error}`}
                </>
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
import { useFocus } from 'src/hooks/useFocus/useFocus';
import { Field, Form, Formik, useField, useFormikContext } from 'formik';
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



// const peer = new Peer({
//     host: 'localhost',
//     port: 9000,
//     path: '/api/v1/peer',
//     // debug: 3,
//     debug: 0,
// });

// const socket = io('ws://localhost:5000', { autoConnect: false, auth: { id: '648835dfc82aa7e61fd0f39f' } });

// let peerId: string | null = null;

// peer.on('open', (id) => {
//     console.log('My peer ID is: ' + id);
//     peerId = id;
// });

// const getMediaStream = (() => {
//     let myMediaStream: MediaStream | null = null;

//     return async(): Promise<MediaStream> => {
//         if (myMediaStream === null) {
//             myMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             return myMediaStream;
//         }

//         return myMediaStream;
//     };
// })();

// const createAudio = (stream: MediaStream) => {
//     console.log('creating audio', [stream]);
//     const audio = document.createElement('audio');
//     audio.autoplay = true;
//     audio.srcObject = stream;
//     audio.controls = true;
//     audio.dataset.who = 'on call';

//     document.querySelector('.container')?.appendChild(audio);
//     console.log(document.querySelector('.container'));
// };

// peer.on('call', (call) => {
//     getMediaStream().then((stream) => {
//         call.answer(stream); // Answer the call with an A/V stream.
//         call.on('stream', (receivedRemoteStream) => {
//             // Show stream in some <video> element.
//             console.log('got stream in CALL', receivedRemoteStream);

//             createAudio(receivedRemoteStream);
//         });
//     });
// });

// let connections: string[] = [];

// socket.on('VoiceChat_data', (peers: string[]) => {
//     console.log('get connect', peers);
//     if (!peers.length) return;

//     connections = peers.filter((id) => id !== peerId);
// });


const useConversation = (conversationId: string) => {

};


// const PlaygroundInner11: FC = () => {

//     const handleJoin = () => {
//         console.log('join to voice chat', peerId);
//         socket.emit('VoiceChat_join', peerId);
//     };

//     const handleCall = async() => {
//         if (!connections.length) return;

//         getMediaStream().then((stream) => {
//             connections.forEach((recivedPeerId) => {
//                 if (recivedPeerId === peerId) return;

//                 const call = peer.call(recivedPeerId, stream);

//                 call.on('stream', (receivedStream) => {
//                     createAudio(receivedStream);
//                 });
//             });
//         });
//     };

//     const handleLeave = () => {
//         console.log('leave click');
//     };

//     return (
//         <div className='flex flex-col gap-4 p-4'>
//             <button onClick={handleJoin}>join</button>

//             <button onClick={handleCall}>call</button>

//             <button onClick={handleLeave}>leave</button>

//             <div className='container'>

//             </div>
//         </div>
//     );
// };

import imagesrc from '@assets/wallpaperflare.com_wallpaper.jpg';
import { AnyRecord } from 'ts-essentials/dist/any-record';
import { AnyArray, AnyFunction, Endpoints, Id, objectKeys, Prettify, SocketClientEvents, SocketServerEvents, StrictExclude, StrictOmit, SUBSCRIBABLE_ENTITIES, Tuple, ValueOf } from '@shared';
import { IMAGES } from '@generated';
import { AppSelectors, AppSlice, ChannelApi, UserApi } from '@redux/features';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { store } from '@redux/store';




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

type ChildrenArgs<FormValues extends AnyRecord, Name extends keyof FormValues> = {
    value: FormValues[Name];
    error: string | null;
    setValue: (val: FormValues[Name], shouldValidate?: boolean) => void;
};

const FormikField = <FormValues extends AnyRecord, Name extends keyof FormValues>({
    name,
    children,
}: {name: Name} & PropsWithChildrenAsNodeOrFunction<ChildrenArgs<FormValues, Name>>) => {
    const [inputProps, metaProps, helperProps] = useField<FormValues[Name]>(String(name));

    const isError = !!metaProps.error && metaProps.touched;

    const childrenArgs: ChildrenArgs<FormValues, Name> = {
        error: isError ? metaProps.error! : null,
        value: inputProps.value,
        setValue: helperProps.setValue,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};



// type FieldType = 'common' | 'radio' | 'checkbox';

// type SafeProps = {

// };

type ChildrenArgs2<FormValues extends AnyRecord, Name extends keyof FormValues> = (
    ReturnType<typeof useField<FormValues[Name]>>
);

const FormikField2 = <FormValues extends AnyRecord, Name extends keyof FormValues>({
    name,
    children,
}: {name: keyof FormValues} & PropsWithChildrenAsNodeOrFunction<ChildrenArgs2<FormValues, Name>>) => {
    const fieldProps = useField<FormValues[Name]>(String(name));

    return (
        <ChildrenAsNodeOrFunction args={fieldProps}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};


type SafeProps<FormValues extends AnyRecord, Name extends keyof FormValues> = {
    common: {
        name: Name;
        value: FormValues[Name];
        setValue: (value: FormValues[Name]) => void;
    },

    radio: {
        name: Name;
        isChecked: (value: FormValues[Name]) => boolean;
        setValue: (value: FormValues[Name]) => void;
    },

    checkbox: {
        name: Name;
        checked: FormValues[Name];
        setValue: (value: FormValues[Name]) => void;
    },
}

type SafePropsTypes = Prettify<keyof SafeProps<never, never>>;

type ChildrenArgs3<
    FormValues extends AnyRecord,
    Name extends keyof FormValues,
    FieldType extends SafePropsTypes
> = (
    [SafeProps<FormValues, Name>[FieldType], ...ReturnType<typeof useField<FormValues[Name]>>]
);

type FormikField3Args<
    FormValues extends AnyRecord,
    Name extends keyof FormValues,
    FieldType extends SafePropsTypes
> = PropsWithChildrenAsNodeOrFunction<ChildrenArgs3<FormValues, Name, FieldType>> & {
    name: Name;
    type: FieldType;
    values: FormValues;
};

const FormikField3 = <FormValues extends AnyRecord, Name extends keyof FormValues, FieldType extends SafePropsTypes>({
    name,
    type,
    values: _,
    children,
}: FormikField3Args<FormValues, Name, FieldType>) => {
    const fieldProps = useField<FormValues[Name]>(String(name));

    const safeProps: SafeProps<FormValues, Name> = {
        common: {
            name,
            value: fieldProps[0].value,
            setValue: fieldProps[2].setValue,
        },
        radio: {
            name,
            isChecked: (v) => v === fieldProps[0].value,
            setValue: fieldProps[2].setValue,
        },
        checkbox: {
            name,
            checked: fieldProps[0].value,
            setValue: fieldProps[2].setValue,
        },
    };

    const childrenArgs: ChildrenArgs3<FormValues, Name, FieldType> = [
        safeProps[type],
        ...fieldProps,
    ];

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
            {({ values }) => (
                <Form>
                    <FormikField<SomeForm, 'username'> name='username'>
                        {({ value }) => (
                            <div className='grid gap-20'>
                                {/* <div>
                                <>{JSON.stringify(o)}</>
                            </div>

                            <div>
                                <>{JSON.stringify(t)}</>
                            </div>

                            <div>
                                <>{JSON.stringify(th)}</>
                            </div> */}
                            </div>
                        )}
                    </FormikField>

                    {/* <CheckBox checked label='' name='' onChange={() => {}}>

                </CheckBox> */}

                    {/* <input type='checkbox' value='wow' name='che' onChange={(e) => console.log(e.target.checked)}/> */}

                    {/* <input type='radio' value='r1' name='rtest'/> */}

                    <FormikField2<SomeForm, 'cool'> name='cool'>
                        {({ name, onChange, value }) => (
                            <CheckBox checked={value} label='' name={name} onChange={onChange}>
                                <>
checkbox
                                    {' '}
                                    {String(value)}
                                </>
                            </CheckBox>
                        )}
                    </FormikField2>

                    <FormikField2<SomeForm, 'union'> name='union'>
                        {({ name, onChange, value }) => (
                            <RadioInput checked={value === 'data'} label='' name={name} onChange={onChange} value='data'>
                                <>
radio 1
                                    {' '}
                                    {String(value)}
                                </>
                            </RadioInput>
                        )}
                    </FormikField2>

                    <FormikField2<SomeForm, 'union'> name='union'>
                        {({ name, onChange, value }) => (
                            <RadioInput checked={value === 'some'} label='' name={name} onChange={onChange} value='some'>
                                <>
radio 2
                                    {' '}
                                    {String(value)}
                                </>
                            </RadioInput>
                        )}
                    </FormikField2>


                    <FormikField2<SomeForm, 'username'> name='username'>
                        {({ name, onChange, value }) => (
                            <TextInput name={name} value={value} onChange={onChange} autoComplete/>
                        )}
                    </FormikField2>

                    <div>
                        {JSON.stringify(values)}
                    </div>

                    <FormikField3 values={initialValues} name='username' type='common'>
                        {({ name, value }) => (
                            <></>
                        )}
                    </FormikField3>

                    <FormikField3 values={initialValues} name='union' type='common'>
                        {({ name, value }) => (
                            <></>
                        )}
                    </FormikField3>

                    {/* <FormikField3<SomeForm> name='username' type='common'>
                        {({ name, value }) => (
                            <></>
                        )}
                    </FormikField3> */}
                </Form>
            )}
        </Formik>
    );
};



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

// const socket = io('ws://localhost:5000', { autoConnect: false }) as Socket<
//     SocketServerEvents,
//     SocketClientEvents
// >;

// const useSocket = () => {
//     const socketRef = useRef(socket);

//     // const isAuthorized = useAppSelector(AppSelectors.selectIsAuthorized);
//     // const { online } = useNetworkState();


// };





const useEntitySubscribe = (entityId: Id, entityName: ValueOf<typeof SUBSCRIBABLE_ENTITIES>) => {
    // const socketRef = useRef(socket);
    // const data = useReduxData();
    const data = {};

    // const subscribeRef = useRef(() => {
    //     socketRef.current.emit(`${entityName}_subscribe`, entityId);
    // });

    // const ubsubscribeRef = useRef(() => {
    //     socketRef.current.emit(`${entityName}_unsubscribe`, entityId);
    // });

    useEffect(() => {
        // socketRef.current.connect();
        // subscribeRef.current();

        // const discListener = socketRef.current.disconnect;
        // const unsubListener = ubsubscribeRef.current;

        // return () => {
        //     unsubListener();
        //     discListener();
        // };
    }, []);

    return data;
};


const PlaygroundInner18: FC = () => {
    // const zxc = useEntitySubscribe('123', 'Channel');
    const dispatch = useAppDispatch();
    const { count, increment, decrement } = useCounter(1);

    return (
        <div className='grid gap-20 p-20'>
            <button onClick={() => dispatch(
                UserApi.endpoints[Endpoints.V1.User.Refresh.ActionNameWithEntity].initiate(),
            )}>
                <>refresh</>
            </button>

            <button onClick={increment}>inc</button>

            <button onClick={decrement}>decr</button>

            <div>
                count is:
                {' '}
                {count}
            </div>

            <div>
                <>qwe1</>
                <Space/>
                <>qwe2</>
                {' '}
                <>qwe3</>

                <span> qwe4</span>
                <span className=''>
                    <>qwe5</>
                    <Space/>
                    <>qwe6</>
                </span>

                <div className='long'>
                    <span>{Array(count).fill('qwe').map((v) => v).join('')}</span>
                </div>
            </div>
        </div>
    );
};
{/* <Icon iconId=''/>; */}

const PlaygroundInner19: FC = () => {
    // console.log(IMAGES);
    return (
        <Scrollable followContentSize className='max-h-screen'>
            <div className='grid gap-20'>
                <List list={objectKeys(IMAGES)}>
                    {(key) => {
                        return (
                            <div className='[&>*]:w-1/2 h-screen [&>*]:h-auto [&>*]:object-contain flex [&>*]:bg-slate-300 [&>*]:outline [&>*]:outline-red-700 [&>*]:outline-4'>
                                <img src={IMAGES[key].path.replace('generatedImages', 'rawImages')}/>

                                <img src={IMAGES[key].path}/>
                            </div>
                        );
                    }}
                </List>
            </div>
        </Scrollable>
    );
};

const Tmp2: FC = () => {
    useEffect(() => {
        console.log('some2');
    });

    return (
        <>
        </>
    );
};

const Tmp: FC<{inc: React.MouseEventHandler<HTMLButtonElement>}> = ({ inc }) => {
    useEffect(() => {
        console.log('some');
    });

    return (
        <>
            <button onClick={inc}>
                <>inc</>
            </button>

            <Tmp2/>
        </>
    );
};

const TmpSetTest: FC<{add: AnyFunction}> = ({ add }) => {
    useEffect(() => {
        console.log('rerender');
    });

    return (
        <button onClick={() => add(String(Math.random()))}>
            <>add</>
        </button>
    );
};

const PlaygroundInner20: FC = () => {
    const { _actions, _value } = useSet(['0']);
    const {
        add,
        has,
        remove,
        reset,
        toggle,
    } = _actions;

    return (
        <div>
            <div>
                <>value is {JSON.stringify(Array.from(_value))}</>
            </div>

            <Memo>
                <TmpSetTest add={add}/>
            </Memo>


            <button onClick={() => console.log(has('0'))}>
                <>has</>
            </button>

            <button onClick={() => remove('0')}>
                <>remove</>
            </button>

            <button onClick={reset}>
                <>reset</>
            </button>

            <button onClick={() => toggle('0')}>
                <>toggle</>
            </button>
        </div>
    );
};

const PlaygroundInner21: FC = () => {
    return (
        <div className='h-screen w-screen overflow-scroll bg-slate-400'>
            <div className='w-[3000px] h-[3000px]'>
                <div className='overflow-scroll h-[50vh] w-[50vw]'>
                    <div className='w-[3000px] h-[3000px] p-20'>
                        <Ref<HTMLDivElement>>
                            {(ref) => (
                                <>
                                    <div ref={ref} className='w-[70px]'>leader</div>

                                    <OverlayContextProvider isOverlayExistInitial>
                                        <OverlayItem>
                                            <RelativelyPositioned
                                                leaderElementOrRectRef={ref}
                                                preferredAlignment='right'
                                                swappableAlignment
                                                spacing={20}
                                                boundsSize={20}
                                            >
                                                <div className='pointer-events-auto bg-rose-700'>qwezxc</div>
                                            </RelativelyPositioned>
                                        </OverlayItem>
                                    </OverlayContextProvider>
                                </>
                            )}
                        </Ref>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlaygroundInner22: FC = () => {
    ChannelApi.useChannelGetOneQuery({ channelId: 'qwe' });

    return (
        <>
            <button>
                <>make request</>
            </button>

            <button>
                <>zxc</>
            </button>
        </>
    );
};

const enabled = !!0;

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
                    {/* <PlaygroundInner17/> */}
                    {/* <PlaygroundInner18/> */}
                    {/* <PlaygroundInner19/> */}
                    {/* <PlaygroundInner20/> */}
                    {/* <PlaygroundInner21/> */}
                    <PlaygroundInner22/>
                </ReactFocusLock>
            </Conditional>
        </>
    );
};