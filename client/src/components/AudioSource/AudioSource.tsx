import { FC } from 'react';
import { useWebRTC, useAppSelector } from 'src/hooks';
import { selectUserInfo } from 'src/redux/features';
import { Audio } from '../Audio/Audio';



export const AudioSource: FC = () => {
    const { streams, getMediaDevicesPermission, connect, disconnect } = useWebRTC();
    const user = useAppSelector(selectUserInfo);
    return (
        <>
            <div>
                <button onClick={() => connect()}>
                    connect
                </button>

                <button onClick={disconnect}>
                    disconnect
                </button>
            </div>

            <div>
                {
                    
                    streams.map((item) => {
                        return (
                            <Audio stream={item} key={item.id}/>
                        );
                    })
                }
            </div>
        </>
    );
};

export default AudioSource;
