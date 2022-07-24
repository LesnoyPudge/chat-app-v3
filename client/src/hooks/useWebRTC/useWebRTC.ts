import { Peer } from 'peerjs';
import { RefObject, useEffect, useRef, useState } from 'react';
import { selectUserInfo } from 'src/redux/features';
import { socket } from 'src/utils';
import { useAppSelector } from '../useAppSelector';



interface IUserStream {
    id: string,
    stream: MediaStream,
}

export const useWebRTC = () => {
    const user = useAppSelector(selectUserInfo);
    const peerRef = useRef<Peer | null>(null);
    const [streams, setStreams] = useState<IUserStream[]>([]);

    console.log(streams);

    useEffect(() => {
        if (!peerRef.current) {
            peerRef.current = new Peer(user.id);
        }
        const peer = peerRef.current;

        peer.on('open', (id) => {
            console.log('connected: ', id);

            getMediaDevicesPermission()
                .then((stream) => {
                    setStreams(prev => [...prev, { id, stream }]);

                    peer.on('call', (call) => {
                        call.answer(stream);

                        call.on('stream', (newStream) => {
                            setStreams(prev => [...prev, { id, stream: newStream }]);
                        });
                    });

                    socket().listeners.user.connectToVoiceRoom(({ userId }) => {
                        console.log('got in rtc: ', userId);
                        connectToNewUser(userId, stream);
                    });
                })
                .catch((e) => console.log(e));
        });
    }, [user.id]);

    const getMediaDevicesPermission = async() => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                noiseSuppression: true,
                echoCancellation: true,
                autoGainControl: false,
                channelCount: 2,
            },
            // video: true,
        });

        return stream;
    };

    function connectToNewUser(userId: string, stream: MediaStream) {
        if (!peerRef.current) return;
        const peer = peerRef.current;
        const call = peer.call(userId, stream);
        setStreams(prev => [...prev, { id: userId, stream }]);
        call.on('stream', userVideoStream => {
            setStreams(prev => [...prev, { id: userId, stream: userVideoStream }]);
        });

        call.on('close', () => {
            setStreams(prev => prev.filter((item) => item.id !== userId));
        });
      
        // peers[userId] = call;
    }

    // const qwe = () => {
    //     peer.on('call', call => {
    //         call.answer(stream);

    //         call.on('stream', stream => {
    //             setStreams(prev => [...prev, { id: stream.id, stream }]);
    //         });
    //     });
    // }

    return {
        getMediaDevicesPermission,
        streams,
    };
};