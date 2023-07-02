import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, RefContext, RefContextProvider, Button, ModalWindow, Memo, Static, Tooltip, OverlayItem, AnimatedTransition, OverlayPortal, ContextMenu , OverlayContext } from '@components';
import { animated, useInView, useSpring, useSpringValue } from '@react-spring/web';
import { Alignment, EncodedFile, OmittedRect, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver, getEnv, getTransitionOptions } from '@utils';
import { Component, createContext, CSSProperties, FC, Fragment, MutableRefObject, PropsWithChildren, PropsWithRef, PureComponent, ReactNode, RefObject, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Attachments, OpenEmojiPickerButton } from 'src/components/other/MessageInputBar/components';
import { useBoolean, useCounter, useEffectOnce, useElementSize, useHover, useImageOnLoad, useInterval, useIsFirstRender, useTimeout, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useSharedIntersectionObserver, useSharedResizeObserver, useTextInput, useThrottle, useWebWorker, useEventListener, useRelativePosition, useAnimationFrame, useRefWithSetter, useProvidedValue, useStateAndRef } from '@hooks';
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


import { AnyArray, IsNever, Primitive, AnyFunction, Tuple, Prettify, ToType, StrictExtract, StrictOmit, objectKeys } from '@shared';
import isCallable from 'is-callable';
import { AnyRecord } from 'ts-essentials/dist/any-record';
import { isOmittedRect, isRef } from '@typeGuards';



interface WithAlignment {
    alignment: Alignment;
}

interface Position {
    top: number;
    left: number;
}
interface RelativePositionOptions {
    preferredAlignment: Alignment;
    swappableAlignment?: boolean;
    boundsSize?: number;
    spacing?: number;
    centered?: boolean;
    unbounded?: boolean;
}

interface WithRects {
    followerRect: OmittedRect;
    leaderRect: OmittedRect;
}

interface UseRelativePositionArgs extends RelativePositionOptions {
    followerElementRef: RefObject<HTMLElement>;
    leaderElementOrRectRef: RefObject<HTMLElement | OmittedRect>;
}

const useRelativePositionV3 = ({
    preferredAlignment,
    followerElementRef,
    leaderElementOrRectRef,
    swappableAlignment = false,
    boundsSize = 0,
    spacing = 0,
    centered = false,
    unbounded = false,
}: UseRelativePositionArgs): WithAlignment => {
    const [alignment, setAlignment] = useState(preferredAlignment);

    const calculateRef = useLatest(() => {
        if (!followerElementRef.current || !leaderElementOrRectRef.current) return;

        const leaderRect = (
            isOmittedRect(leaderElementOrRectRef.current)
                ? leaderElementOrRectRef.current
                : leaderElementOrRectRef.current.getBoundingClientRect()
        );
        
        const { alignment: newAlignment, left, top } = calculateRelativePosition({
            followerRect: followerElementRef.current.getBoundingClientRect(),
            leaderRect: leaderRect,
            boundsSize,
            centered,
            preferredAlignment,
            spacing,
            swappableAlignment,
            unbounded,
        });

        if (alignment !== newAlignment) setAlignment(newAlignment);

        const follower = followerElementRef.current;
        if (follower.style.top === `${top}px` && follower.style.left === `${left}px`) return;
  
        follower.style.top = `${top}px`;
        follower.style.left = `${left}px`;
    });

    // useLayoutEffect(() => {
    //     console.log('calc 1');
    //     calculateRef.current();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


    useAnimationFrame(calculateRef.current);
    
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
    unbounded,
}: Required<RelativePositionOptions> & WithRects): Position & WithAlignment => {
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
        top: unbounded ? -9999 : boundsSize,
        bottom: unbounded ? 9999 : window.innerHeight - boundsSize - followerRect.height,
        left: unbounded ? -9999 : boundsSize,
        right: unbounded ? 9999 : window.innerWidth - boundsSize - followerRect.width,
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

type RelativelyPositionedV3 = RelativePositionOptions & Pick<
    UseRelativePositionArgs, 
    'leaderElementOrRectRef'
> & PropsWithChildrenAsNodeOrFunction<WithAlignment>;

const RelativelyPositionedV3: FC<RelativelyPositionedV3> = ({ 
    leaderElementOrRectRef,
    preferredAlignment,
    swappableAlignment,
    centered,
    spacing = 20,
    boundsSize = 20,
    unbounded,
    children, 
}) => {
    const followerElementRef = useRef<HTMLDivElement>(null);
    const { alignment } = useRelativePositionV3({
        preferredAlignment,
        followerElementRef,
        leaderElementOrRectRef,
        swappableAlignment,
        centered,
        spacing,
        boundsSize,
        unbounded,
    });

    const childrenArgs: WithAlignment = {
        alignment,
    };
    
    return (
        <div className='fixed' ref={followerElementRef}>
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

const TooltipV2: FC<PropsWithChildren & {leaderElementRef: RefObject<HTMLElement>}> = ({ children, leaderElementRef }) => {
    const [isExist, setIsExist] = useState(false);
    const [withKeyboardRef, setWithKeyboard] = useRefWithSetter(false);
    const [withMouseRef, setWithMouse] = useRefWithSetter(false);
    const styles = {
        base: `bg-primary-500 text-color-base font-bold py-[5px] px-2.5 
        rounded-md w-max max-w-[300px] shadow-elevation-low`,
    };
    const changeState = () => {
        const newState = withKeyboardRef.current || withMouseRef.current;
        if (newState === isExist) return;

        setIsExist(newState);
    };

    const handleFocusIn = (e: FocusEvent) => {
        if (!leaderElementRef.current) return;
        if (e.target !== leaderElementRef.current) return;

        setWithKeyboard(true);
        changeState();
    };
    
    const handleFocusOut = (e: FocusEvent) => {
        if (!leaderElementRef.current) return;
        if (e.target !== leaderElementRef.current) return;
        
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

    useEventListener('focusin', handleFocusIn, leaderElementRef);
    useEventListener('focusout', handleFocusOut, leaderElementRef);
    useEventListener('mouseenter', handleMouseEnter, leaderElementRef);
    useEventListener('mouseleave', handleMouseLeave, leaderElementRef);

    useSharedIntersectionObserver(leaderElementRef, ({ isIntersecting }) => {
        if (isIntersecting === isExist) return;
        if (!withKeyboardRef.current && !withMouseRef.current) return;

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
                            <RelativelyPositionedV3
                                leaderElementOrRectRef={leaderElementRef}
                                preferredAlignment='top'
                            >
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

const SynchronizedPlaceholder: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    const elementToSyncRef = useRef<HTMLDivElement>(null);
    const styles = {
        base: 'animate-pulse bg-sky-700',
    };
    useEffect(() => {
        if (!elementToSyncRef.current) return;

        elementToSyncRef.current.getAnimations().forEach((animation) => {
            animation.startTime = 0;
        });
    }, []);

    return (
        <div 
            className={twClassNames(styles.base, className)}
            ref={elementToSyncRef}
        >
            {children}
        </div>
    );
};


type ContextMenuV2 = (
    PropsWithClassName & 
    PropsWithChildrenAsNodeOrFunction<OverlayContext> &
    Pick<UseRelativePositionArgs, 'preferredAlignment'> & {
        leaderElementRef: RefObject<HTMLElement>;
        withContextMenuHandler?: boolean;
    }
)

export const ContextMenuV2: FC<ContextMenuV2> = ({
    className = '',
    preferredAlignment,
    leaderElementRef,
    withContextMenuHandler = false,
    children,
}) => {
    const contextValues = useContext(OverlayContext) as OverlayContext;
    const leaderElementOrRectRef = useRef<HTMLElement | OmittedRect | null>(leaderElementRef.current);
    const baseClassName = 'pointer-events-auto bg-primary-500 rounded text-color-base p-5';
    const transitionOptions = getTransitionOptions.defaultContextMenu();
    const withRightClickRef = useRef(false);
    
    useEffect(() => {
        if (withRightClickRef.current) {
            withRightClickRef.current = false;
            return;
        }
        
        leaderElementOrRectRef.current = leaderElementRef.current;
    }, [contextValues.isOverlayExist, leaderElementRef]);


    const handleContextMenu = (e: MouseEvent) => {
        if (!withContextMenuHandler) return;

        const { closingThrottleRef, openOverlay } = contextValues;
        
        if (closingThrottleRef.current) return;

        withRightClickRef.current = true;
        const withMouse = e.button !== -1;
        const withKeyboard = !withMouse;
    
        if (withMouse) {
            const cursorSize = 1;
    
            leaderElementOrRectRef.current = {
                top: e.clientY,
                bottom: e.clientY + cursorSize,
                left: e.clientX,
                right: e.clientX + cursorSize,
                width: cursorSize,
                height: cursorSize,
            };
        }

        if (withKeyboard) {
            leaderElementOrRectRef.current = e.currentTarget as HTMLElement;
        }

        openOverlay();
    };

    useEventListener('contextmenu', handleContextMenu, leaderElementRef);

    return (
        <AnimatedTransition 
            isExist={contextValues.isOverlayExist}
            transitionOptions={transitionOptions}
        >
            {({ isAnimatedExist, style }) => (
                <OverlayItem 
                    isRendered={isAnimatedExist}
                    blockable
                    blocking
                    closeOnClickOutside
                    closeOnEscape
                    focused
                >
                    <RelativelyPositionedV3
                        leaderElementOrRectRef={leaderElementOrRectRef}
                        preferredAlignment={preferredAlignment}
                        spacing={15}
                        boundsSize={20}
                        swappableAlignment
                    >
                        <animated.div 
                            className={twClassNames(baseClassName, className)}
                            style={style}
                            role='menu'
                        >
                            <ChildrenAsNodeOrFunction args={contextValues}>
                                {children}
                            </ChildrenAsNodeOrFunction>
                        </animated.div>
                    </RelativelyPositionedV3>
                </OverlayItem>
            )}
        </AnimatedTransition>
    );
};

const UseRef = <T extends HTMLElement = HTMLDivElement>({
    children,
}: PropsWithChildrenAsNodeOrFunction<{ref: MutableRefObject<T | null>}>) => {
    const ref = useRef<T | null>(null);
    
    return (
        <ChildrenAsNodeOrFunction args={{ ref }}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};

const PlaygroundInner13: FC = () => {
    return (
        <div className='flex flex-col gap-20 p-20 [&>*]:bg-sky-900 overflow-scroll max-h-screen'>
            <UseRef>
                {({ ref }) => (
                    <OverlayContextProvider>
                        {({ toggleOverlay }) => (
                            <>
                                <div 
                                    className='min-h-[150px]'
                                    ref={ref}
                                    tabIndex={0}
                                    onClick={toggleOverlay}
                                    onAuxClickCapture={toggleOverlay}
                                >
                                    <>right click on plate</>
                                </div>
    
                                <ContextMenuV2 
                                    className='bg-sky-600' 
                                    preferredAlignment='right'
                                    leaderElementRef={ref}
                                    withContextMenuHandler
                                >
                                    <>qwe 3</>
                                </ContextMenuV2>
                      
                                <TooltipV2 leaderElementRef={ref}>
                                    <>qwezxc</>
                                </TooltipV2>
                            </>
                        )}
                    </OverlayContextProvider>
                )}
            </UseRef>

            {/* <OverlayContextProvider>
                {({ toggleOverlay }) => (
                    <UseRef<HTMLButtonElement>>
                        {({ ref }) => (
                            <>
                                <Button 
                                    stylingPreset='brand' 
                                    onLeftClick={toggleOverlay}
                                    innerRef={ref}
                                >
                                    <>butt1</>
                                </Button>

                                <ContextMenuInnerV2 
                                    className='bg-sky-600' 
                                    preferredAlignment='right'
                                    leaderElementRef={ref}
                                >
                                    <>qwe 3</>
                                </ContextMenuInnerV2>
                            </>
                        )}
                    </UseRef>
                )}
            </OverlayContextProvider> */}







            <List list={Array(60).fill('')}>
                <br/>
            </List>
        </div>
    );
};

const FIRSTCOMP: FC<{inRef: RefObject<HTMLDivElement>}> = ({ inRef }) => {
    return (
        <div data-wow={1} ref={inRef}>
            <>1</>
        </div>
    );
};
const SECONDCOMP: FC<{inRef: RefObject<HTMLDivElement>}> = ({ inRef }) => {
    console.log('init', inRef, performance.now());
    
    useEffect(() => {
        console.log('eff', inRef, performance.now());
    }, [inRef]);

    useLayoutEffect(() => {
        console.log('lay eff', inRef, performance.now());
    }, [inRef]);
    
    return (
        <div data-wow={2}>
            <>2</>
        </div>
    );
};
const THIRDCOMP: FC<{inRef: RefObject<HTMLDivElement>}> = ({ inRef }) => {
    return (
        <div data-wow={3}>
            <>3</>
        </div>
    );
};

const UseRefAsState: FC<PropsWithChildrenAsNodeOrFunction<[HTMLDivElement | null, (node: HTMLDivElement) => void]>> = ({
    children,
}) => {
    const [el, setEl] = useState<HTMLDivElement | null>(null);
    return (
        <ChildrenAsNodeOrFunction args={[el, setEl]}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};

const PlaygroundInner14: FC = () => {
    return (
        <div className='flex flex-col gap-8 p-8'>
            <UseRef>
                {({ ref }) => (
                    <>
                        <FIRSTCOMP inRef={ref}/>
                        <SECONDCOMP inRef={ref}/>
                        <THIRDCOMP inRef={ref}/>
                    </>
                )}
            </UseRef>
        </div>
    );
};

const TestComp: FC<PropsWithChildren & {which: number}> = ({ children, which }) => {
    const { count, increment } = useCounter(0);

    useEffect(() => {
        console.log(`TestComp rerender ${which}`, children);
    });

    return (
        <div className='flex flex-col gap-2'>
            <div>test comp {which}</div>

            <p>count is {count}</p>

            <button onClick={increment}>
                <>inc</>
            </button>

            {children}
        </div>
    );
};

const PlaygroundInner15: FC = () => {
    const [count, countRef, setCount] = useStateAndRef(0);
    const even = count % 2 === 0;

    const inc = useCallback(() => {
        console.log(countRef.current);
        setCount((v) => v + 1);
    }, [setCount, countRef]);

    return (
        <div className='flex flex-col gap-2'>
            <span>count is: {count}</span>
            
            <button onClick={inc}>
                <>inc</>
            </button>

            <Memo>
                <TestComp which={1}>
                    <Memo>
                        <div>
                            <p>
                                <>qwe</>
                            </p>
                        </div>
                    </Memo>
                </TestComp>
            </Memo>

            <Static>
                <TestComp which={2}>
                    <>zxc {count}</>
                </TestComp>
            </Static>
        </div>
    );
};

const PlaygroundInner16: FC = () => {
    return (
        <div className='flex flex-col gap-2'>
            <>qwe</>
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
                    {/* <PlaygroundInner12/> */}
                    {/* <PlaygroundInner13/> */}
                    {/* <PlaygroundInner14/> */}
                    {/* <PlaygroundInner15/> */}
                    <PlaygroundInner16/>
                </ReactFocusLock>
            </Conditional>
        </>
    );
};