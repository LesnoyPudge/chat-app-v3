import { MediaConnection, Peer } from 'peerjs';
import { RefObject, useEffect, useRef, useState } from 'react';
import { selectUserInfo } from 'src/redux/features';
import { useAppSelector } from '../useAppSelector';
import { log, socket } from '@utils';



interface IUserStream {
    id: string,
    streamSrc: MediaStream,
}

export const useWebRTC = () => {
    // const user = useAppSelector(selectUserInfo);
    // const peerRef = useRef<Peer | null>(null);
    // const [streams, setStreams] = useState<IUserStream[]>([]);

    // log(streams);

    // const connect = (roomId?: string) => {
    //     if (!peerRef.current) {
    //         peerRef.current = new Peer(user.id);
    //     }
    //     const peer = peerRef.current;
    //     if (!roomId) {
    //         log('work in progress \n execution stops without voice room id');
    //         return;
    //     }
    //     socket.events.user.connectToVoiceRoom(roomId);

    //     peer.on('open', (id) => {
    //         log('connected: ', id);

    //         getMediaDevicesPermission()
    //             .then((stream) => {
    //                 if (!streams.some((item) => item.id === id)) {
    //                     log('tyt');
    //                     setStreams(prev => [...prev, { id, streamSrc: stream }]);
    //                 }

    //                 peer.on('call', (call) => {
    //                     log('trying to answer call: ', call, stream);
    //                     call.answer(stream);

    //                     call.on('stream', (newStream) => {
    //                         if (streams.some((item) => item.id === id)) return;
    //                         log('tyt');
    //                         setStreams(prev => [...prev, { id, streamSrc: newStream }]);
    //                     });
    //                 });

    //                 // socket().listeners.user.connectToVoiceRoom(({ userId }) => {
    //                 //     log('got in rtc: ', userId);
    //                 //     connectToNewUser(userId, stream);
    //                 // });
    //             })
    //             .catch((e) => log(e));
    //     });
    // };

    // const disconnect = () => {
    //     // socket leave room
    //     const peer = peerRef.current;
    //     if (!peer) return;

    //     peer.disconnect();
    //     peer.removeAllListeners();
    //     peer.destroy();
    //     setStreams([]);
    // };

    // // useEffect(() => {
    // //     if (!peerRef.current) {
    // //         peerRef.current = new Peer(user.id);
    // //     }
    // //     const peer = peerRef.current;

    // //     peer.on('open', (id) => {
    // //         log('connected: ', id);

    // //         getMediaDevicesPermission()
    // //             .then((stream) => {
    // //                 if (!streams.some((item) => item.id === id)) {
    // //                     log('tyt');
    // //                     setStreams(prev => [...prev, { id, streamSrc: stream }]);
    // //                 }

    // //                 peer.on('call', (call) => {
    // //                     log('trying to answer call: ', call, stream);
    // //                     call.answer(stream);

    // //                     call.on('stream', (newStream) => {
    // //                         if (streams.some((item) => item.id === id)) return;
    // //                         log('tyt');
    // //                         setStreams(prev => [...prev, { id, streamSrc: newStream }]);
    // //                     });
    // //                 });

    // //                 socket().listeners.user.connectToVoiceRoom(({ userId }) => {
    // //                     log('got in rtc: ', userId);
    // //                     connectToNewUser(userId, stream);
    // //                 });
    // //             })
    // //             .catch((e) => log(e));
    // //     });
    // // }, [user.id]);

    // const getMediaDevicesPermission = async() => {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: {
    //             noiseSuppression: true,
    //             echoCancellation: true,
    //             autoGainControl: false,
    //             channelCount: 2,
    //         },
    //         // video: {
    //         //     frameRate: 60,
    //         // }
    //     });

    //     return stream;
    // };

    // function connectToNewUser(userId: string, stream: MediaStream) {
    //     if (!peerRef.current) return;
    //     const peer = peerRef.current;
    //     const call = peer.call(userId, stream);
    //     if (!streams.some((item) => item.id === userId)) {
    //         log('tyt: ' + 'userId: ' + userId, 'stream: ' + streams);
    //         setStreams(prev => [...prev, { id: userId, streamSrc: stream }]);
    //     }
        
    //     call.on('stream', userVideoStream => {
    //         // if (streams.some((item) => item.id === userId)) return;
    //         log('tyt');
    //         setStreams(prev => [...prev, { id: userId, streamSrc: userVideoStream }]);
    //     });

    //     call.on('close', () => {
    //         const updatedValue = streams.filter((item) => item.id !== userId);
    //         setStreams(updatedValue);
    //     });
      
    //     // peers[userId] = call;
    // }

    // return {
    //     getMediaDevicesPermission,
    //     streams,
    //     connect,
    //     disconnect,
    // };
};