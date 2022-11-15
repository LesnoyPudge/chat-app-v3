import { Icon, Button } from '@components';
import { useConditional, useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import React, { FC } from 'react';



interface IRoom {
    id: string;
    name: string;
    type: 'voice' | 'text';
}

interface IRoomListItem {
    room: IRoom;
    tabIndex: number;
}

const styles = {
    item: `flex justify-start items-center w-full h-8 px-2 
    cursor-pointer rounded-md hover:bg-hover 
    focus-visible:bg-hover`,
};

export const RoomListItem: FC<IRoomListItem> = ({ 
    room,
    tabIndex,
}) => {
    const { myLocationIs, params, navigateTo } = useNavigator();
    const [iconId] = useConditional(
        'voice-room-icon', 
        'text-room-icon', 
        room.type === 'voice',
    );

    const channelId = params.channelId as string;
    const isActive = myLocationIs.room(channelId, room.id);

    const navigateToRoom = () => navigateTo.room(channelId, room.id);

    const handleClick = navigateToRoom;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.code !== 'Enter' && e.code !== 'Space') return;
        navigateToRoom();
    };

    return (
        <li 
            className={twClassNames(styles.item, { 'bg-hover': isActive })}
            tabIndex={tabIndex}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <Icon
                className='h-5 w-5 fill-icon-300' 
                iconId={iconId}
            />

            <span className='ml-1.5'>
                {room.name}
            </span>

            <Button
                className='ml-auto'
                isntStyled
                tabIndex={tabIndex}
            >
                <>action</>
            </Button>
        </li>
    );
};