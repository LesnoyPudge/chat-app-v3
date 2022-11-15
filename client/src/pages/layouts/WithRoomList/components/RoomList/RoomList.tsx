import { FocusableListItem, FocusableListWrapper } from '@components';
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
        <>
            <FocusableListWrapper className='mt-4 h-full overflow-y-scroll scrollbar-primary scrollbar-with-gutters'>
                <ul className='grid gap-1'>
                    {rooms.map((room, index) => {
                        return (
                            <FocusableListItem index={index} key={room.id}>
                                {({ tabIndex }) => (
                                    <RoomListItem 
                                        room={room} 
                                        tabIndex={tabIndex}
                                    />
                                )}
                            </FocusableListItem>
                        );
                    })}
                </ul>
            </FocusableListWrapper>
        </>
    );
};