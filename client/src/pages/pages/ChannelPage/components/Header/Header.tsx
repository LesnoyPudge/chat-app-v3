import { SpriteImage, TopBar } from '@components';
import { useNavigator } from '@hooks';
import { Heading } from '@libs';
import { FC } from 'react';



export const Header: FC = () => {
    const { params } = useNavigator();

    const roomLabel = `Комната ${params.roomId}`;

    return (
        <TopBar className='px-4'>
            <SpriteImage
                className='h-6 w-6 fill-icon-300'
                name='TEXT_ROOM_ICON'
            />

            <Heading className='ml-2 text-color-primary font-bold truncated'>
                {roomLabel}
            </Heading>
        </TopBar>
    );
};