import { FC } from 'react';
import { SplitedPageLayout } from '../components';
import { Header, RoomList } from './components';



export const WithRoomList: FC = () => {
    return (
        <SplitedPageLayout>
            <Header/>

            <RoomList/>
        </SplitedPageLayout>
    );
};