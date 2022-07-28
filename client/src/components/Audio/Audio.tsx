import { FC, useEffect, useRef } from 'react';
import { useAppSelector } from 'src/hooks';
import { selectUserInfo } from 'src/redux/features';



interface IAudio {
    stream: {
        id: string,
        streamSrc: MediaStream,
    }
}

export const Audio: FC<IAudio> = ({ stream }) => {
    const user = useAppSelector(selectUserInfo);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isMuted = stream.id === user.id;
    // const { getMediaDevicesPermission } = useWebRTC();

    // useEffect(() => {
    //     if (!audioRef.current) return;
    //     const audio = audioRef.current;
    //     getMediaDevicesPermission().then((stream) => {
    //         audio.srcObject = stream;
    //     });
        
    // }, [getMediaDevicesPermission]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.srcObject = stream.streamSrc;
    }, [stream.streamSrc]);

    return (
        <>
            <audio autoPlay ref={audioRef} muted={isMuted}></audio>
        </>
    );
};