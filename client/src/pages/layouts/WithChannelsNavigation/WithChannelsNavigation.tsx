import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ChannelsNavigation } from './components';



const styles = {
    wrapper: 'flex h-[100dvh] w-[100dvw]',
}

export const WithChannelsNavigation: FC = () => {
    return (
        <div className={styles.wrapper}>
            <ChannelsNavigation/>

            <Outlet/>
        </div>
    );
};