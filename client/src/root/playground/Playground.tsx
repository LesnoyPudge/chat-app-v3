import { Image, ChannelSettingsModal, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, Button, ModalWindow, Memo, Static, Tooltip, OverlayItem, AnimatedTransition, OverlayPortal, ContextMenu , OverlayContext, RelativelyPositioned, CheckBox, RadioInput, TextInput,SpriteImage, Space, Ref, MoveFocusInside, TabContext, TabContextProvider, CreateChannelModal, UserStatus, Emoji, emojiRegExp, emojiList, getEmojiMatch, FocusInside, Separator } from '@components';
import { animated, useInView, useSpring, useSpringValue } from '@react-spring/web';
import { Alignment, EncodedFile, OmittedRect, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver, getEnv, getTransitionOptions, getDiff, setTitle, logger } from '@utils';
import React, { Component, createContext, CSSProperties, FC, Fragment, MutableRefObject, PropsWithChildren, PropsWithRef, PureComponent, ReactNode, RefObject, Suspense, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Actions, useBoolean, useCounter, useDocumentTitle, useEffectOnce, useElementSize, useHover, useImageOnLoad, useInterval, useIsFirstRender, useIsMounted, useLocalStorage, useMap, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useSharedIntersectionObserver, useSharedResizeObserver, useTextInput, useThrottle, useWebWorker, useEventListener, useRelativePosition, useAnimationFrame, useRefWithSetter, useProvidedValue, useStateAndRef, UseRelativePositionArgs, useKeyboardNavigation, useLatest, usePromise, ControlledPromise, useTimeout, useSet } from '@hooks';
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
                    <>loading:</>
                    <Space/>
                    {`${imageState.loading}`}
                    <Space/>
                    <>error:</>
                    <Space/>
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

                <If condition={imageState.loading}>
                    <div className='absolute inset-0 bg-lime-500'>
                    </div>
                </If>
            </div>
        </>
    );
};


import getScrollableParent from 'scrollparent';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { Field, Form, Formik, useField, useFormikContext } from 'formik';
import SimpleBar from 'simplebar-react';
// import { Chat } from 'src/components/other/Chat/Chat';
import { SingleEntryObserverCallback } from 'src/utils/observers/types';
import ReactFocusLock, { AutoFocusInside, FreeFocusInside,
    InFocusGuard } from 'react-focus-lock';
// import { useUserLoginMutation, useUserRegistrationMutation } from '@redux/features';
import { io, Socket } from 'socket.io-client';
import { audioBase } from './audioBase64';





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

import { AnyRecord } from 'ts-essentials/dist/any-record';
import { AnyArray, AnyFunction, Endpoints, Entities, getRandomNumber, Id, objectKeys, Prettify, SocketClientEvents, SocketServerEvents, StrictExclude, StrictOmit, SUBSCRIBABLE_ENTITIES, Tuple, ValueOf } from '@shared';
import { IMAGES } from '@generated';
import { AppSelectors, AppSlice, ChannelApi, HelperApi, UserApi, UserSelectors, UserSlice } from '@redux/features';
import { useAppDispatch, useAppSelector, useMemoSelector } from '@redux/hooks';
import { RootState, store } from '@redux/store';
import { Key } from 'ts-key-enum';
import { memoize } from 'proxy-memoize';
import { createMemoSelector } from '@redux/utils';
import isObject from 'is-object';
import { Placeholder } from 'src/components/shared/Placeholder';
import { socketIO } from '../features/soket';
import { EntityContext, EntityContextHelpers, EntityContextProvider } from 'src/components/contexts/EntityContext/EntityContext';



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
        <div className='flex flex-col gap-2 h-dvh'>
            {/* <Image
                placeholder={<div className='bg-red-700'>qwe</div>}
                src='https://images.placeholders.dev'
            /> */}

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

//     // const isAuthorized = useMemoSelector(AppSelectors.selectIsAuthorized);
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
    const { dispatch } = useAppDispatch();
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
{/* <SpriteImage name=''/>; */}

const PlaygroundInner19: FC = () => {
    // console.log(IMAGES);
    return (
        <Scrollable followContentSize className='max-h-dvh'>
            <div className='grid gap-20'>
                <List list={objectKeys(IMAGES)}>
                    {(key) => {
                        return (
                            <div className='[&>*]:w-1/2 h-dvh [&>*]:h-auto [&>*]:object-contain flex [&>*]:bg-slate-300 [&>*]:outline [&>*]:outline-red-700 [&>*]:outline-4'>
                                {/* <img src={IMAGES[key].path.replace('generatedImages', 'rawImages')}/>

                                <img src={IMAGES[key].path}/> */}
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


const PlaygroundInner21: FC = () => {
    return (
        <div className='h-dvh w-dvw overflow-scroll bg-slate-400'>
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
    const [refresh] = UserApi.useUserRefreshMutation();
    const qwe = useMemoSelector(AppSelectors.selectAppState, []);

    useEffect(() => {
        if (qwe.isInitialized) return;
        console.log('refresh');
        refresh();
    }, [refresh, qwe]);

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


type UseFocusVisibleArgs = {
    providedElement: RefObject<HTMLElement> | HTMLElement | null;
}

// const arrowKeys = [Key.ArrowDown, Key.ArrowLeft, Key.ArrowRight, Key.ArrowUp];

// const keyboardInteractionTimeoutDuration = 50;

// const outline = document.createElement('div');
// const devRoot = getHTML().dev;
// devRoot.append(outline);

// const useFocusVisible = () => {
//     const isInKeyboardInteractionModeRef = useRef(false);
//     const keyboardInteractionTimeoutRef = useRef(0);

//     const isValidTarget = (target: EventTarget | null): target is HTMLElement => {
//         if (!target) return false;
//         if (!(target instanceof HTMLElement)) return false;
//         if (target.hasAttribute('data-focus-guard')) return false;

//         return true;
//     };

//     const handleKeydown = (e: KeyboardEvent) => {
//         if (e.metaKey || e.altKey || e.ctrlKey) {
//             return;
//         }

//         const isTabForward = (e.key === Key.Tab) && !e.shiftKey;
//         const isTabBackward = (e.key === Key.Tab) && e.shiftKey;
//         const isArrowKey = arrowKeys.includes(e.key);

//         if (!isTabBackward && !isTabForward && !isArrowKey) return;

//         // console.log(e.key, e.shiftKey);

//         clearTimeout(keyboardInteractionTimeoutRef.current);

//         isInKeyboardInteractionModeRef.current = true;

//         keyboardInteractionTimeoutRef.current = setTimeout(() => {
//             isInKeyboardInteractionModeRef.current = false;
//         }, keyboardInteractionTimeoutDuration);
//     };

//     const handleFocus = (e: FocusEvent) => {
//         if (!isInKeyboardInteractionModeRef.current) return;

//         const target = e.target;
//         if (!isValidTarget(target)) return;

//         console.log('focus', target);
//         console.log(outline);
//         const targetRect = target.getBoundingClientRect();
//         const targetStyle = window.getComputedStyle(target);

//         outline.style.width = targetRect.width + 'px';
//         outline.style.height = targetRect.height + 'px';
//         // outline.style.outlineWidth = '4px';
//         // outline.style.outlineColor = '#00aff4';
//         // outline.style.outlineStyle = 'solid';
//         outline.className = 'focused';
//         outline.style.borderRadius = targetStyle.borderRadius;
//         outline.style.position = 'fixed';
//         outline.style.top = Math.max(targetRect.top, 4) + 'px';
//         outline.style.left = Math.max(targetRect.left, 4) + 'px';

//     };

//     const handleBlur = (e: FocusEvent) => {
//         // if (!isInKeyboardInteractionModeRef.current) return;

//         const target = e.target;
//         if (!isValidTarget(target)) return;

//         console.log('blur', target);
//         outline.className = '';
//     };

//     useEventListener('keydown', handleKeydown, document);
//     useEventListener('focusin', handleFocus, document);
//     useEventListener('focusout', handleBlur, document);

//     useEffect(() => {
//         return () => {
//             clearTimeout(keyboardInteractionTimeoutRef.current);
//         };
//     }, []);

//     // return setElement;
// };




// const list = Array(20).fill(null).map((_, i) => `item ${i}`);
const list = Array(1).fill(null).map((_, i) => ({ id: `item ${i}` }));

const PlaygroundInner23: FC = () => {
    // useFocusVisible();

    const listRef = useRef(list);
    // const {
    //     getIsFocused,
    //     getTabIndex,
    //     setRoot,
    //     setFocusedId,
    // } = useKeyboardNavigation(listRef, undefined, { loop: true, direction: 'vertical' });

    return (
        <ReactFocusLock autoFocus>
            <>
                <>
                    <div>
                        <button tabIndex={0}>
                            <>here?</>
                        </button>
                        <div
                            className='p-8 overflow-auto max-h-[50vh]'
                            // ref={setRoot}
                            aria-label='wwo'
                            tabIndex={0}
                        >
                            <div className='flex flex-col gap-8 items-start [&>*]:bg-rose-800 [&>*]:text-white'>
                                <List list={list}>
                                    {(item) => {
                                        return (
                                            <MoveFocusInside enabled={false}>
                                                <div>

                                                </div>

                                                <button
                                                    // tabIndex={getTabIndex(item.id)}
                                                    tabIndex={-1}
                                                    // disabled={!getIsFocused(item.id)}
                                                    // onClick={() => setFocusedId(item.id)}
                                                >
                                                    <>qwe {item.id}</>
                                                </button>
                                            </MoveFocusInside>
                                        );
                                    }}
                                </List>
                            </div>
                        </div>
                    </div>
                </>
            </>
        </ReactFocusLock>
    );
};







const slideStyles = {
    wrapper: 'text-black font-bold px-6',
    first: {
        wrapper: 'bg-rose-600',
    },
    second: {
        wrapper: 'bg-green-400 h-[200px]',
    },
};

const FirstSlide: FC = () => {
    const [setEl, size] = useElementSize();

    return (
        <div className={twClassNames(slideStyles.wrapper, slideStyles.first.wrapper)} ref={setEl}>
            <>1</>

            <Space/>

            {size.width}
        </div>
    );
};


const SecondSlide: FC = () => {
    const [setEl, size] = useElementSize();

    return (
        <div className={twClassNames(slideStyles.wrapper, slideStyles.second.wrapper)} ref={setEl}>
            <>2</>

            <Space/>

            {size.width}
        </div>
    );
};

const TestTabs = {
    first: <FirstSlide/>,
    second: <SecondSlide/>,
};

const TabScroller: FC = () => {
    const {
        tabs,
        currentTab,
        isActive,
        changeTab,
    } = useContext<TabContext<typeof TestTabs>>(TabContext);

    const orederRef = useLatest(Object.keys(tabs).reduce((acc, key, index) => {
        acc[key] = index;

        return acc;
    }, {} as Record<keyof typeof tabs, number>));

    useInterval(() => {
        isActive.first ? changeTab.second() : changeTab.first();
    }, 2000);



    return (
        <div>
            <div className='p-3 bg-slate-400 flex justify-center'>
                <div className='overflow-hidden w-[min(440px,100vw)]'>
                    <div
                        className='flex items-end'
                        style={{
                            // translate: `${(isActive.first ? 0 : -1) * 100}%`,
                        }}
                    >
                        <AnimatedTransition
                            transitionOptions={{
                                from: { x: 0 },
                                enter: { x: 0 },
                                leave: { x: -100 },
                            }}
                            isExist={isActive.first}
                        >
                            {({ style, isAnimatedExist }) => (
                                <animated.div
                                    style={{
                                        translate: style.x.to((v) => `${v}%`),
                                    }}
                                    className='shrink-0 w-full'
                                >
                                    {tabs.first.tab}
                                </animated.div>
                            )}
                        </AnimatedTransition>

                        <AnimatedTransition
                            transitionOptions={{
                                from: { x: 100 },
                                enter: { x: 0 },
                                leave: { x: 100 },
                            }}
                            isExist={isActive.second}
                        >
                            {({ style, isAnimatedExist }) => (
                                <animated.div
                                    style={{
                                        translate: style.x.to((v) => `${v}%`),
                                    }}
                                    className='shrink-0 w-full'
                                >
                                    {tabs.second.tab}
                                </animated.div>
                            )}
                        </AnimatedTransition>

                        {/*
                        <div className='shrink-0 w-full'>
                            {tabs.second.tab}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};



const PlaygroundInner24: FC = () => {
    return (
        <TabContextProvider tabs={TestTabs}>
            <div>
                <>QWEZXC</>
            </div>

            <TabScroller/>
        </TabContextProvider>
    );
};



// const selectCount = createMemoSelector(({ app, amount }: {app: RootState['app'], amount: number}) => {
//     console.log('tmp', amount);
//     return {
//         count: app.first,
//         count2: app.first * amount,
//     };
// });

// const First: FC = () => {
//     const { value, handleChange } = useTextInput('0');
//     const counter = useCounter(0);

//     const first = useMemoSelector((state) => {
//         return selectCount({
//             app: AppSelectors.selectAppState(state),
//             amount: parseInt(value),
//         });
//     }, [value]);

//     const { dispatch } = useAppDispatch();


//     return (
//         <>
//             <div>
//                 <span>
//                     {counter.count}

//                     <button onClick={counter.increment}>
//                         <>inc</>
//                     </button>
//                 </span>
//             </div>
//             <div>
//                 {Math.random()}
//             </div>

//             <input type='text' value={value} onChange={handleChange}/>

//             <div>
//                 <>first is:</>

//                 <Space/>

//                 {first.count}

//                 <Space/>

//                 {first.count2}
//             </div>

//             <button onClick={() => dispatch(AppSlice.actions.inc())}>
//                 <>inc</>
//             </button>
//         </>
//     );
// };

// const selectText = (state: RootState) => ({
//     text: state.app.second,
//     uppercase: state.app.second.toUpperCase(),
// });


// const Second: FC = () => {
//     const second = useMemoSelector(selectText);
//     const { value, handleChange } = useTextInput(second.text);
//     const { dispatch } = useAppDispatch();

//     return (
//         <>
//             <div>
//                 {Math.random()}
//             </div>

//             <div>
//                 <>second is:</>

//                 <Space/>

//                 {second.text}

//                 <Space/>

//                 {second.uppercase}
//             </div>

//             <input className='bg-slate-500' type='text' value={value} onChange={handleChange}/>

//             <button onClick={() => dispatch(AppSlice.actions.setText(value))}>
//                 <>inc</>
//             </button>
//         </>
//     );
// };

// const Third: FC = () => {
//     const myId = useMemoSelector((state) => AppSelectors.selectAppState(state).myId);

//     return (
//         <div>
//             <div>
//                 <>third</>
//             </div>

//             <div>
//                 {Math.random()}
//             </div>

//             <div>
//                 {String(myId)}
//             </div>
//         </div>
//     );
// };

// const PlaygroundInner25: FC = () => {

//     return (
//         <div className='flex flex-col gap-2 items-start p-6'>
//             <First/>

//             <Second/>

//             <Third/>
//         </div>
//     );
// };



const PlaygroundInner26: FC = () => {

    return (
        <div className='flex flex-col gap-2 items-start p-6'>
            <div>
                <>qwe</>
            </div>
            <div className=''>
                {/* <svg id='my-svg' viewBox='0 0 24 24' className=''>
                    <circle cx='50' cy='50' r='40' fill='blue' />
                </svg> */}

                <svg id='my-svg' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M2 5C2 4.05719 2 3.58579 2.29289 3.29289C2.58579 3 3.05719 3 4 3H20C20.9428 3 21.4142 3 21.7071 3.29289C22 3.58579 22 4.05719 22 5C22 5.94281 22 6.41421 21.7071 6.70711C21.4142 7 20.9428 7 20 7H4C3.05719 7 2.58579 7 2.29289 6.70711C2 6.41421 2 5.94281 2 5Z'/>
                    <path fillRule='evenodd' clipRule='evenodd' d='M20.0689 8.49993C20.2101 8.49999 20.3551 8.50005 20.5 8.49805V12.9999C20.5 16.7711 20.5 18.6568 19.3284 19.8283C18.1569 20.9999 16.2712 20.9999 12.5 20.9999H11.5C7.72876 20.9999 5.84315 20.9999 4.67157 19.8283C3.5 18.6568 3.5 16.7711 3.5 12.9999V8.49805C3.64488 8.50005 3.78999 8.49999 3.93114 8.49993H20.0689ZM14.9995 12.1906C15.3085 12.4664 15.3353 12.9405 15.0595 13.2495L11.488 17.2495C11.3457 17.4089 11.1422 17.5 10.9286 17.5C10.7149 17.5 10.5114 17.4089 10.3691 17.2495L8.94055 15.6495C8.66468 15.3405 8.69152 14.8664 9.0005 14.5906C9.30947 14.3147 9.78359 14.3415 10.0595 14.6505L10.9286 15.6239L13.9406 12.2505C14.2164 11.9415 14.6905 11.9147 14.9995 12.1906Z'/>
                </svg>
            </div>
            {/* <Image
                className='w-[300px] h-[300px] fill-slate-300'
                src={SVGImage}
            /> */}

            <div className='relative w-[50px] h-[50px] fill-rose-400'>
                <svg className='w-[50px] h-[50px]'>
                    <use xlinkHref='#my-svg'/>
                </svg>
            </div>

            {/* <SVGImage className='w-[300px] h-[300px] fill-rose-300'/> */}

            <SpriteImage className='w-[50px] h-[50px] fill-rose-400' name='HEADPHONE'/>
        </div>
    );
};

const PlaygroundInner27: FC = () => {
    const user = useMemoSelector(AppSelectors.selectMe, []);
    const [login] = UserApi.useUserLoginMutation();

    useEffectOnce(() => {
        const users = {
            1: {
                login: 'qwe1',
                password: 'zxc',
            },
            2: {
                login: 'qwe2',
                password: 'zxc',
            },
            3: {
                login: 'qwe3',
                password: 'zxc',
            },
            4: {
                login: 'qwe4',
                password: 'zxc',
            },
            5: {
                login: 'qwe5',
                password: 'zxc',
            },
        };

        login(users[1]);
    });

    return (
        <code className=''>
            {Object.keys(user).map((key, i) => {

                return (
                    <div key={i}>
                        {key}

                        <>:</>

                        <Space/>

                        {JSON.stringify(user[key])}
                    </div>
                );
            })}
        </code>
    );
};

// const PromiseSuspense = <T extends AnyRecord>({
//     promise,
//     children,
// }: {
//     promise: ControlledPromise<T>,
// } & PropsWithChildrenAsNodeOrFunction<T>) => {
//     const [data, setData] = useState<T | null>(promise.data);

//     promise.promise.then(setData);

//     return (
//         <>

//             {
//                 data ? (
//                     <ChildrenAsNodeOrFunction args={data}>
//                         {children}
//                     </ChildrenAsNodeOrFunction>
//                 ) : null
//             }
//         </>
//     );
// };

// const testPromise = new Promise<string>((res) => {
//     setTimeout(() => {
//         res('qwe');
//     }, 2000);
// });

// testPromise.then((v) => {
//     console.log('resolved', v);
// });

// setTimeout(() => {
//     console.log(testPromise);
// }, 5000);

// socketIO.connect();
// socketIO.emit('User_subscribe', '123');


// import transformer from 'tsx-control-statements';
// import { If } from 'tsx-control-statements/components';


const PlaygroundInner28: FC = () => {
    const id1 = '64d6407ac557763795df726d';
    const id2 = '64d8b4bf6d3e0ab5e5e9eb39';
    const [state, toggle] = useToggle(true);
    const idToShow = state ? id1 : id2;
    const value: object | null = (() => {
        return Math.random() < 0.5 ? { some: 'data' } : null;
    })();

    return (
        <div className='flex flex-col gap-6'>
            <button onClick={toggle}>
                <>{String(state)}</>
            </button>

            <If condition={!!value}>
                <>{JSON.stringify(Object.keys(value!))}</>
            </If>

            <div>
                <EntityContextProvider.User id={idToShow}>
                    {(data) => (
                        <>
                            <If condition={!!data}>
                                <>{JSON.stringify(data)}</>
                            </If>

                            <If condition={!data}>
                                <>loading</>
                            </If>
                        </>
                    )}
                </EntityContextProvider.User>
            </div>

            <div>
                <EntityContextProvider.User id={idToShow}>
                    {(data) => (
                        <>
                            <If condition={!!data}>
                                <>{JSON.stringify(data)}</>
                            </If>

                            <If condition={!data}>
                                <>loading</>
                            </If>
                        </>
                    )}
                </EntityContextProvider.User>
            </div>


            {/*
            <EntityContextProvider.User id='64d8b44ee6cc309ce68b1f0e'>
                {({ data }) => (
                    <>
                        <If condition={!!data}>
                            <>{JSON.stringify(data)}</>
                        </If>

                        <If condition={!data}>
                            <>loading</>
                        </If>

                        <EntityContext.User.Consumer>
                            {({ data }) => (
                                <>
                                    <If condition={!!data}>
                                        <>{JSON.stringify(data)} 2</>
                                    </If>

                                    <If condition={!data}>
                                        <>loading</>
                                    </If>
                                </>
                            )}
                        </EntityContext.User.Consumer>
                    </>
                    // <PromiseSuspense promise={promise}>
                    //     {({ data }) => (
                    //         <>{data}</>
                    //     )}
                    // </PromiseSuspense>
                )}
            </EntityContextProvider.User> */}

            {/* <Placeholder>
                qwe
            </Placeholder> */}
        </div>
    );
};


const Scroller: FC = () => {
    return (
        <>
        </>
    );
};

const Tab1: FC = () => {
    return (
        <div>1</div>
    );
};

const Tab2: FC = () => {
    return (
        <div>2</div>
    );
};



const PlaygroundInner29: FC = () => {
    const tabs = [
        Tab1,
        Tab2,
    ];
    return (
        <div className='grid gap-4'>
            <OverlayContextProvider isOverlayExistInitial>
                <ModalWindow label=''>
                    <div className='bg-purple-600'>
                        <>qwe</>
                    </div>
                </ModalWindow>
            </OverlayContextProvider>
        </div>
    );
};




import { EmojiNode, $createEmojiNode, $isEmojiNode } from './emoji';
import { Translation, useTranslation } from 'react-i18next';
import { TRANSLATION } from '@i18n';
import { ChatV3 } from 'src/components/shared/ChatV2/ChatV2';
import { createEditor, Descendant } from 'slate';
import { RichTextEditor, RTEModules, RTETypes } from 'src/components/inputs/RichTextEditor/index';
import { Editable, Slate, useSlate, withReact } from 'slate-react';
import { ErrorBoundary } from 'react-error-boundary';
import { JSONView } from '@dev';






const PlaygroundInner30: FC = () => {
    const [slateState, setSlateState] = useState(() => RTEModules.Utils.createInitialValue());

    useTimeout(() => {
        setSlateState(RTEModules.Utils.createInitialValue());
    }, 3000);

    return (
        <div className='p-2 h-full'>
            <div className='border-orange-900 border-8 h-full flex flex-col'>


                {/* <RichTextEditor.ContextProvider
                    label=''
                    name=''
                    placeholder='placeholder'
                    value={slateState}
                    onChange={setSlateState}
                >
                    <RichTextEditor.Editable/>
                </RichTextEditor.ContextProvider> */}
            </div>
        </div>
    );
};

const PlaygroundInner31: FC = () => {
    const { t } = useTranslation();
    const [isOpen, toggle] = useToggle(false);

    return (
        <div>
            <button onClick={toggle}>
                <>toggle</>
            </button>

            <If condition={isOpen}>
                <Suspense fallback={<>loading...</>}>
                    <Translation ns={[TRANSLATION.NAMESPACES.LOADABLE]} useSuspense>
                        {(t) => (
                            <div>
                                {t('Welcome to React')}

                                {t('Not defined key')}
                            </div>
                        )}
                    </Translation>
                </Suspense>
            </If>

            <div>
                {t('wow', { ns: TRANSLATION.NAMESPACES.BUNDLED })}
            </div>
        </div>
    );
};

const PlaygroundInner32: FC = () => {
    const [res, { run }] = useWebWorker(() => {
        return Math.random();
    });

    return (
        <div>
            <button onClick={() => run()}>
                <>run</>
            </button>

            <div>
                <>result: {String(res)}</>
            </div>
        </div>
    );
};

const PlaygroundInner33: FC = () => {

    return (
        <ReactFocusLock>
            <div className='grid gap-4'>
                <button>
                    <>1</>
                </button>

                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <button ref={ref}>
                                <>some button</>
                            </button>

                            <Tooltip
                                className='bg-stone-600'
                                leaderElementRef={ref}
                                preferredAlignment='right'
                            >
                                <>text</>
                            </Tooltip>
                        </>
                    )}
                </Ref>

                <button>
                    <>2</>
                </button>

                <button>
                    <>3</>
                </button>
            </div>
        </ReactFocusLock>
    );
};

const PlaygroundInner34: FC = () => {
    const [editorState, setEditorState] = useState<string>();
    const [slateState, setSlateState] = useState(() => RTEModules.Utils.createInitialValue());
    const [states, setStates] = useState([
        RTEModules.Utils.createInitialValue('first'),
        RTEModules.Utils.createInitialValue('second'),
        RTEModules.Utils.createInitialValue('third'),
    ]);
    const [count, setCount] = useState(0);

    const setStates2 = (val: RTETypes.Nodes) => {
        setStates(prev => {
            const newV = [...prev];
            newV[count] = val;

            return newV;
        });
    };

    return (
        <div>
            {/* <EntityContextProvider.Chat id='1' fakeEntity={{
                id: '1',
                messages: [],
                owner: 'Room',
                ownerId: '2',
            }}>
                <ChatV3.Room/>
            </EntityContextProvider.Chat> */}

            <div className='grid gap-2 mb-2'>
                <button onClick={() => setCount(0)}>
                    <>1</>
                </button>

                <button onClick={() => setCount(1)}>
                    <>2</>
                </button>

                <button onClick={() => setCount(2)}>
                    <>3</>
                </button>
            </div>

            <div className='grid gap-2'>
                <div>
                    <>editor1 string value is {JSON.stringify(slateState)}</>
                </div>

                <div>
                    <>editor2 string value is {JSON.stringify(editorState)}</>
                </div>

                <div>
                    {/* <>editor parsed value is {String(parseEditorState(editorState))}</> */}
                </div>
            </div>
        </div>
    );
};


const MidMidTest: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div>
            <>midmid: {Math.random()}</>

            {children}
        </div>
    );
};

const MidTest: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div>
            <>mid: {Math.random()}</>

            <MidMidTest>
                {children}
            </MidMidTest>
        </div>
    );
};

const InnerTest: FC = () => {
    const { counter = null } = useContext(TestContext) ?? {};

    return (
        <div>
            <div>count: {counter}</div>
            <div>inner: {Math.random()}</div>
        </div>
    );
};

const TestContext = createContext<{ counter: number }>();

const PlaygroundInner35: FC = () => {
    const c = useCounter(0);

    const contextValues = useMemo(() => ({
        counter: c.count,
    }), [c.count]);

    return (
        <TestContext.Provider value={contextValues}>
            {/* <If condition>

            </If> */}
            <div>
                <button onClick={c.increment}>
                    <>inc</>
                </button>

                <Memo>
                    <MidTest>
                        <InnerTest/>
                    </MidTest>
                </Memo>
            </div>
        </TestContext.Provider>
    );
};

const initial = RTEModules.Utils.createInitialValue('initial');

const Inner: FC<PropsWithChildren & {
    reff: MutableRefObject<RTETypes.Editor | null>
}> = ({
    reff,
    children,
}) => {
    const editor = useSlate();

    reff.current = editor;

    return (
        <>{children}</>
    );
};


const FallbackScreen: FC = () => {
    return (
        <div>
            <>fallback</>
        </div>
    );
};

const PlaygroundInner37: FC = () => {
    const [val, setVal] = useState(initial);

    const onSubmit = useCallback((v: RTETypes.Nodes) => {
        logger.log(v);
        setVal(initial);
    }, []);

    const editor = useMemo(() => RTEModules.Utils.createEditorWithPlugins({
        characterLimit: {
            maxLength: 15,
        },
    }), []);

    useEffect(() => console.log('2) 1'));

    return (
        <div>
            <div>wow 2</div>

            {/* <Button stylingPreset='brand' onLeftClick={editor.reset}>
                <>reset</>
            </Button> */}

            {/* <ErrorBoundary fallbackRender={FallbackScreen}> */}
            {/* <Slate editor={editor} initialValue={initial}>
                <Editable/>
            </Slate> */}
            {/* </ErrorBoundary> */}
        </div>
    );
};

const PlaygroundInner38: FC = () => {
    return (
        <>
            <EntityContextProvider.Chat 
                id='1' 
                fakeEntity={{
                    id: '1', 
                    messages: [], 
                    owner: 'PrivateChannel',
                    ownerId: '123'
                }}
            >
                {/* <MessageInputBar/> */}
            </EntityContextProvider.Chat>
        </>
    )
}
import reactFastCompare from "react-fast-compare";
import { Main } from 'src/dev/WIP';
const PlaygroundInner39: FC = () => {
    const [state, setState] = useState(
        RTEModules.Utils.createInitialValue('hehe:poop:xd')
    );
    useEffect(() => {
        console.log(state)
    }, [state])
    const editor2 = useMemo(() => withReact(createEditor()), []);

    return (
        <div className='[&>button]:block'>
            <button 
                onClick={() => setState(
                    RTEModules.Utils.createInitialValue('hehe:poop:xdd')
                )}
            >
                <>reset</>
            </button>

            <button onClick={() => setState(
                RTEModules.Utils.createInitialValue()
            )}>
                <>clear</>
            </button>

            <RichTextEditor.ContextProvider
                name='message'
                value={state}
                onChange={(value) => {
                    if (Object.is(value, state)) return;

                    setState(value)
                }}
            >
                <RichTextEditor.ContentEditable/>
            </RichTextEditor.ContextProvider>

            <JSONView data={state}/>
        </div>
    )
}

import {} from 'slate-react'
import { withHistory } from 'slate-history';
import { useConst } from '@lesnoypudge/utils-react';
import { randomUUID } from 'crypto';
import { nanoid } from '@reduxjs/toolkit';
import { ConversationService } from './ConversationService';
import { PopupMenu } from 'src/components/overlay/PopupMenu';
import { ScrollableV2 } from 'src/dev/WIP/ScrollableV2';
import { loremIpsum } from 'lorem-ipsum';

const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
]

const PlaygroundInner40: FC = () => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const styles = {
        editor: ' before:bg-green-800 before:content-[""] before:absolute before:inset-0',
    }
    
    const _styles = styles;
    
    const [state, setState] = useState(initialValue)
    
    return (
        <>
            <RichTextEditor.ContextProvider 
                name=''
                onChange={setState}
                value={state}
                placeholder='hold me'
            >
                <RichTextEditor.ContentEditable/>
            </RichTextEditor.ContextProvider>

            {/* <Slate 
                editor={editor} 
                initialValue={initialValue}
                // onChange={setState}
                onValueChange={setState}
                // onChange={(v) => {
                //     console.log(JSON.stringify(v))
                // }}
            >   
                <Editable
                    className={_styles.editor}
                    placeholder='place'
                    renderPlaceholder={({ children, attributes }) => {
                        return (
                            <div {...attributes}>
                                <p>{children}</p>
                            </div>
                        )
                    }}
                />
            </Slate> */}
            
            {window.navigator.userAgent}

            <JSONView data={state}/>
        </>
    )
}

const getStunServers = async() => {
    const url = [
        'https://raw.githubusercontent.com/',
        'pradt2/always-online-stun/master/valid_hosts.txt'
    ].join('');
    
    const stunServers = await (
        fetch(url)
        .then((res) => res.text())
        .catch(() => undefined)
    );
    if (!stunServers) return;

    return stunServers.split('\n').filter(Boolean).map((server) => {
        return `stun:${server}`;
    });
}


class VoiceChatService {
    private myId: string;
    private socket: Socket;
    private peerConnection: RTCPeerConnection | null = null;
    private currentId: string | null = null;
    private stunServers: string[] | null = null;
    private iceCandidate: RTCIceCandidate | null = null;
    private offer: {
        sdp: string | undefined;
        type: RTCSdpType;
    } | null = null;
    private connections: {
        iceCandidate: RTCIceCandidateInit;
        offer: {
            sdp: string | undefined;
            type: RTCSdpType;
        }
    }[] | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;


    constructor(userId: string, socket: Socket) {
        this.myId = userId;
        this.socket = socket;
    }

    reset() {
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
        console.log(navigator.mediaDevices)
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



const AudioItem: FC<{
    streamEntry: [string, MediaStream],
    streamsMethods: Actions<string, MediaStream>,
}> = ({
    streamEntry,
    streamsMethods,
}) => {
    const [userId, stream] = streamEntry
    const audioRef = useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = useState(1);

    const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
        if (!audioRef.current) return;
        audioRef.current.volume = volume;
    }

    const toggleMute = () => {
        const el = audioRef.current;
        if (!el) return;
        
        el.muted = !el.muted;
    }

    const stop = () => {
        stream.getTracks().forEach((track) => stream.removeTrack(track))
        streamsMethods.remove(userId)
    }

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        el.srcObject = stream
    }, [])

    return (
        <li className='flex gap-2'>
            <div>
                <>user: {userId}</>
            </div>
            
            <button onClick={toggleMute}>
                <>toggleMute</>
            </button>

            <button onClick={stop}>
                <>stop</>
            </button>

            <audio 
                autoPlay
                ref={audioRef}
            />

            <input 
                type='range' 
                value={volume}
                min={0} 
                max={1} 
                step={0.01}
                onChange={onVolumeChange}
            />
        </li>
    )
}

type UserId = string;
type SocketId = string;

const stunServers = await getStunServers();

// const conversation = new ConversationService(nanoid(5));

const EMPTY_STATE = Symbol.for('EMPTY_STATE')

const USE_CONST_WEAKMAP = new WeakMap();

const useConst2 = <_Value,>(
    factory: () => _Value, 
    cleanup?: (v: _Value) => void
) => {
    const ref = useRef<_Value>(EMPTY_STATE as _Value);

    if (ref.current === EMPTY_STATE) {
        ref.current = factory()
    }

    useEffect(() => {
        return () => cleanup?.(ref.current)
    }, [])

    return ref.current;
}

const myId = nanoid(5);
const conversation = new ConversationService(myId)

const PlaygroundInner41: FC = () => {
    const c = useCounter(0)
    // const ref = useConst2(() => nanoid(), (v) => console.log('clean', v))
    // console.log('ref', ref)

    // const myId = useConst2(() => nanoid(5));
    // const [users, usersMethods] = useMap<UserId, {
    //     socketId: SocketId;
    //     data: Record<string, unknown>
    // }>()
    // const [streams, streamsMethods] = useMap<UserId, MediaStream>()
    // const [peerData, setPeerData] = useState<{
    //     iceCandidate: RTCIceCandidate;
    //     offer: {
    //         sdp: string | undefined;
    //         type: RTCSdpType;
    //     };
    // } | null>(null);
    // const peerConnection = useConst(() => new RTCPeerConnection({
    //     iceCandidatePoolSize: 10,
    //     iceServers: [{ urls: stunServers?.slice(0, 3) ?? '' }],
    // }))
    // const [remoteStream] = useState(new MediaStream())
    // const conversation = useConst2(() => {
    //     console.log('USE_CONST')
    //     return new ConversationService((() => {
    //         console.log('generateID')
    //         return nanoid(5)
    //     })())
    // }, (v) => v.cleanup());
    // const conversation = useConst2(() => {
    //     // console.log('USE_CONST')
    //     return new ConversationService((() => {
    //         console.log('generateID')
    //         return myId
    //     })())
    // }, (v) => v.cleanup());

    console.log('id:', myId, conversation)
    
    // const join = async() => {
    //     if (!peerData) {
    //         const localStream = streams.get(myId);
    //         if (!localStream) {
    //             console.log('local stream required')
    //             return;
    //         }

    //         localStream.getTracks().forEach((track) => {
    //             if (!peerConnection || !localStream) return;

    //             peerConnection.addTrack(track, localStream);
    //         });

    //         peerConnection.ontrack = (event) => {
    //             console.log('on track', event.streams);

    //             event.streams.forEach((stream) => {
    //                 stream.getAudioTracks().forEach((track) => {

    //                 })
    //             })

    //             event.streams[0].getTracks().forEach((track) => {
    //                 // streamsMethods.set(event.)
    //                 remoteStream.addTrack(track);
    //                 peerConnection?.addTrack(track, event.streams[0]);
    //             });
    //         };

    //         peerConnection.onicecandidate = (event) => {
    //             if (!event.candidate) return;
    //             // if (!peerData) return;
    //             console.log('on ice', event.candidate);
    //             // peerData.iceCandidate = event.candidate;
    //             // @ts-expect-error
    //             setPeerData((prev) => ({
    //                 ...prev,
    //                 iceCandidate: event.candidate
    //             }))
    //         };

    //         const offerDescription = await peerConnection.createOffer();
    //         await peerConnection.setLocalDescription(offerDescription);

    //         // @ts-expect-error
    //         setPeerData((prev) => ({
    //             ...prev,
    //             offer: {
    //                 sdp: offerDescription.sdp,
    //                 type: offerDescription.type,
    //             }
    //         }))
            
    //         return;
    //     }

    //     // @ts-expect-error
    //     socketIO.emit('Conversation_subscribe', {
    //         userId: myId,
    //         data: {
    //             iceCandidate: peerData.iceCandidate?.toJSON(),
    //             offer: peerData.offer,
    //         }
    //     })
    // }

    // const leave = () => {
    //     // conversation.leave()
    //     // @ts-expect-error
    //     socketIO.emit('Conversation_unsubscribe')
    // }

    const isMounted = useIsMounted()

    // const requestMedia = () => {
    //     navigator.mediaDevices.getUserMedia({
    //         audio: {
    //             echoCancellation: false,
    //             noiseSuppression: true,
    //         }
    //     }).then((stream) => {
    //         if (!isMounted()) return;
            
    //         streamsMethods.set(myId, stream)
    //         // console.log('got media', stream)
    //     });
    // }

    // useEffect(() => {
    //     return;
    //     // if (!onceRef.current)
    //     console.log('effect run')
    //     socketIO.connect();

    //     const handler = (
    //         conversationId: string, 
    //         data: {
    //             users: [string, {
    //                 socketId: string;
    //                 data: NonNullable<typeof peerData>
    //             }][]}
    //     ) => {
    //         console.log('got data', data)
    //         usersMethods.setAll(data.users)

    //         data.users.forEach(([userId, userPeerData]) => {
    //             if (userId === myId) return;

    //             const answerDescription = new RTCSessionDescription(
    //                 userPeerData.data.offer
    //             );
                
    //             peerConnection.setRemoteDescription(answerDescription);

    //             const candidate = new RTCIceCandidate(peerData?.iceCandidate);
    //             peerConnection.addIceCandidate(candidate);



    //         });
    //     }

    //     // @ts-expect-error
    //     socketIO.on('Conversation_data', handler)

    //     // socketIO.onAny((...data) => {
    //     //     console.log('anyEvent', data)
    //     // })
    //     socketIO.on('connect', () => {
    //         // usersMethods.set(myId, socketIO.id);
    //     })
        
        

    //     return () => {
    //         // socketIO.off('Conversation_data', handler)
    //         // socketIO.emit('Conversation_unsubscribe', myId)
           
    //         socketIO.removeAllListeners()
    //         socketIO.disconnect()
    //     }
    // }, [])

    // useEffect(() => {
    //     fetch(getEnv().CUSTOM_SERVER_URL, {
    //         method: 'get'
    //     }).then((v) => {
    //         console.log('wow')
    //     }).catch((e) => {
    //         console.log('err', e)
    //     })
    // }, [])

    const [isConnected, setIsConnected] = useState(() => socketIO.connected)

    useEffect(() => {
        socketIO.on('connect', () => {
            setIsConnected(socketIO.connected)
        })

        socketIO.on('disconnect', () => {
            setIsConnected(socketIO.connected)
        })
    }, [])

    const message = useTextInput('')
    
    return (
        <div>
            <div className='flex flex-col gap-4 [&>*]:outline-zinc-500'>
                <div>
                    <>count: {c.count}</>
                </div>

                <button onClick={c.increment}>
                    <>inc</>
                </button>

                <div>
                    <>isConnected: {String(isConnected)}</>
                </div>

                <div>
                    <>userId: {myId} socket.id: {String(socketIO.id)}</>
                </div>

                <button onClick={() => socketIO.connect()}>
                    <>connect</>
                </button>

                <button onClick={() => conversation.join('zxc')}>
                    <>join</>
                </button>

                <button onClick={() => {
                    conversation.sendMessage(message.value)
                }}>
                    <>send message</>
                </button>

                <input 
                    type='text' 
                    name='message'
                    value={message.value}
                    onChange={message.handleChange}
                />

                <div id='chat'></div>
            </div>
        </div>
    )

    // return (
    //     <div>
    //         <div>my id: {myId}</div>

    //         <div className='flex flex-col gap-4'>
    //             <div>controls</div>
            
    //             <button onClick={join}>
    //                 <>join</>
    //             </button>

    //             <button onClick={leave}>
    //                 <>leave</>
    //             </button>

    //             <button onClick={requestMedia}>
    //                 <>requestMedia</>
    //             </button>
    //         </div>

    //         <div>
    //             <div>users count: {users.size}</div>

    //             <ul>
    //                 {Array.from(users.entries()).map(([userId, data]) => {
    //                     return (
    //                         <li key={userId}>
    //                             <>
    //                                 {
    //                                     myId === userId 
    //                                         ? 'me' 
    //                                         : 'user'
    //                                 }: {userId} : {data.socketId}
    //                             </>
    //                         </li>
    //                     )
    //                 })}
    //             </ul>
    //         </div>

    //         <div>
    //             <div>streams count: {streams.size}</div>

    //             <ul>
    //                 {Array.from(streams.entries()).map((streamEntry) => (
    //                     <AudioItem 
    //                         key={streamEntry[0]} 
    //                         streamEntry={streamEntry}
    //                         streamsMethods={streamsMethods}
    //                     />
    //                 ))}

    //                     <AudioItem 
    //                         streamEntry={['qwe', remoteStream]}
    //                         streamsMethods={streamsMethods}
    //                     />
    //             </ul>
    //         </div>
    //     </div>
    // )
}


const PlaygroundInner42: FC = () => {
    const ref = useRef<HTMLButtonElement>(null)

    return (
        <div>
            <OverlayContextProvider isOverlayExistInitial>
                {({openOverlay}) => (
                    <>
                        <button onClick={openOverlay} ref={ref}>
                            <>wow</>
                        </button>

                        <PopupMenu.Wrapper 
                            leaderElementOrRectRef={ref}
                            label=''
                        >
                            <PopupMenu.Item>
                                <>qwezxc</>
                            </PopupMenu.Item>

                            <PopupMenu.Separator/>

                            <PopupMenu.Item>
                                <>zxcqwe</>
                            </PopupMenu.Item>
                        </PopupMenu.Wrapper>
                    </>
                )}
            </OverlayContextProvider>
        </div>
    )
}

const PlaygroundInner43: FC = () => {
    return (
        <div className='h-[500px] bg-slate-500'>
            <ScrollableV2
                direction='vertical'
                size='small'
                withOppositeGutter
            >
                <div>
                    {Array(999).fill('').map((_, id) => {
                        return (
                            <div key={id} className='text-nowrap'>
                                <>item {id} {loremIpsum({count: 50})}</>
                            </div>
                        )
                    })}
                </div>
            </ScrollableV2>
        </div>
    )
}


export const Playground: FC<PropsWithChildren> = ({ children }) => {
    // const [enabled, setEnabled] = useLocalStorage('playground', false);

    // useEventListener('keydown', (e) => {
    //     if (e.key !== '+') return;

    //     setEnabled((v) => !v);
    // }, window);

    return (
        <>
            {/* <If condition={!enabled}>
                {children}
            </If> */}

            {/* <If condition={enabled}> */}
                {/* <PlaygroundInner29/> */}
                {/* <PlaygroundInner30/> */}
                {/* <PlaygroundInner31/> */}
                {/* <PlaygroundInner34/> */}
                {/* <PlaygroundInner35/> */}
                {/* <PlaygroundInner36/> */}
                {/* <PlaygroundInner37/> */}
                {/* <PlaygroundInner38/> */}
                {/* <PlaygroundInner39/> */}
                {/* <Main/> */}
                {/* <PlaygroundInner40/> */}
                <PlaygroundInner42/>
            {/* </If> */}
        </>
    );
};