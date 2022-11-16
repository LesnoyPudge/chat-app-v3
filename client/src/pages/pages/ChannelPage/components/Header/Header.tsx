import { Icon, TopBar } from '@components';
import { useNavigator } from '@hooks';
import { FC } from 'react';



export const Header: FC = () => {
    const { params } = useNavigator();

    const roomLabel = `Комната ${params.roomId}`;

    return (
        <TopBar className='px-4'>
            <Icon
                className='h-6 w-6 fill-icon-300'
                iconId='text-room-icon'
            />

            <span 
                className='ml-2 text-primary font-bold text-ellipsis
                overflow-hidden whitespace-nowrap'
            >
                {roomLabel}
            </span>
        </TopBar>
    );
};