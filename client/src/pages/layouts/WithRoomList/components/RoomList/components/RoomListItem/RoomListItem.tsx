import { Icon, Button } from '@components';
import { useNavigator } from '@hooks';
import { conditional, twClassNames } from '@utils';
import { FC } from 'react';



interface IRoom {
    id: string;
    name: string;
    type: 'voice' | 'text';
}

interface IRoomListItem {
    room: IRoom;
}

const styles = {
    item: {
        base: `flex justify-start items-center w-full h-8 px-2 
        cursor-pointer rounded-md hover:bg-hover 
        focus-visible:bg-hover`,
        active: 'bg-hover',
    },
};

export const RoomListItem: FC<IRoomListItem> = ({ room }) => {
    const { myLocationIs, params, navigateTo } = useNavigator();
    const channelId = params.channelId as string;
    
    const navigateToRoom = () => navigateTo.room(channelId, room.id);

    const iconId = conditional('voice-room-icon', 'text-room-icon', room.type === 'voice');
    const isActive = myLocationIs.room(channelId, room.id);

    return (
        <li>
            <Button
                className={twClassNames(
                    styles.item.base, 
                    { [styles.item.active]: isActive },
                )}
                onLeftClick={navigateToRoom}
            >
                <Icon
                    className='h-5 w-5 fill-icon-300' 
                    iconId={iconId}
                />

                <span className='ml-1.5'>
                    {room.name}
                </span>
            </Button>
        </li>
    );
};