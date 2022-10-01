import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ChannelsNavigation } from './components';



export const AppLayout: FC = () => {
    return (
        <>
            <div className='flex h-screen w-screen overflow-hidden'>
                <ChannelsNavigation/>

                <Outlet/>
            </div>
        </>
    );
};