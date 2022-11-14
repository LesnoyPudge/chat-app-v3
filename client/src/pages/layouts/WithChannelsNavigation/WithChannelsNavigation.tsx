import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ChannelsNavigation } from './components';



export const WithChannelsNavigation: FC = () => {
    return (
        <div className='flex h-screen w-screen'>
            <ChannelsNavigation/>

            <div className='flex w-full overflow-hidden'>
                <Outlet/>
            </div>
        </div>
    );
};