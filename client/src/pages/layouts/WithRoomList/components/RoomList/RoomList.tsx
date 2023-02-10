import { ArrowFocusContextProvider, Scrollable } from '@components';
import { FC } from 'react';
import { RoomListItem } from './components';



interface IRoom {
    id: string;
    name: string;
    type: 'voice' | 'text';
}

const rooms: IRoom[] = [
    {
        id: '1',
        name: 'amazing room',
        type: 'voice',
    },
    {
        id: '2',
        name: 'cool room',
        type: 'text',
    },
    {
        id: '3',
        name: 'awesome room',
        type: 'voice',
    },
];

export const RoomList: FC = () => {
    return (
        <Scrollable 
            className='mt-4' 
            withOppositeGutter
            small
        >
            <ul className='flex flex-col gap-1'>
                {rooms.map((room) => (
                    <RoomListItem room={room} key={room.id}/>
                ))}
            </ul>
        </Scrollable>
    );
};