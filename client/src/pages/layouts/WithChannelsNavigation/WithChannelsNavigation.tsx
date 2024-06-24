import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ChannelsNavigation } from './components';



const styles = {
    wrapper: 'flex h-dvh w-dvw',
}

export const WithChannelsNavigation: FC = () => {
    return (
        <div className={styles.wrapper}>
            <ChannelsNavigation/>

            <Outlet/>
        </div>
    );
};