import { useNavigator } from '@hooks';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const channels = [
    { avatar: '', id: '1asd', name: 'amazing channel', rooms: [{ id: '1' }] }, 
    { avatar: '', id: '2yk', name: 'wow', rooms: [{ id: '2' }] },
    { avatar: '', id: '3eh', name: 'first', rooms: [{ id: '2' }] },
    { avatar: '', id: '4tu.', name: '2', rooms: [{ id: '2' }] },
    { avatar: '', id: '5szb', name: '3', rooms: [{ id: '2' }] },
    { avatar: '', id: '6tru', name: '4', rooms: [{ id: '2' }] },
    { avatar: '', id: '7nfk', name: '5', rooms: [{ id: '2' }] },
    { avatar: '', id: '8f.', name: '6', rooms: [{ id: '2' }] },
    { avatar: '', id: '9aerg', name: '7', rooms: [{ id: '2' }] },
    { avatar: '', id: '10uik', name: '8', rooms: [{ id: '2' }] },
    { avatar: '', id: '11ou;', name: '9', rooms: [{ id: '2' }] },
    { avatar: '', id: '12wfEGA', name: '1 0', rooms: [{ id: '2' }] },
    { avatar: '', id: '13tyhd', name: '1 1', rooms: [{ id: '2' }] },
    { avatar: '', id: '14zfbv', name: '1 2', rooms: [{ id: '2' }] },
    { avatar: '', id: '15sryth', name: '1 3', rooms: [{ id: '2' }] },
    { avatar: '', id: '16gra', name: '1 4 4 56 78 8', rooms: [{ id: '2' }] },
    { avatar: '', id: '17tyjtjd', name: 'last', rooms: [{ id: '2' }] },
];

export const NavigateToRoom: FC = () => {
    const { params } = useNavigator();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!params.channelId) return;

        const channel = channels.find((item) => item.id === params.channelId);

        if (!channel) return;

        const room = channel.rooms[0];

        navigate(`room/${room.id}`, { replace: true });
    }, [navigate, params.channelId]);

    return null;
};