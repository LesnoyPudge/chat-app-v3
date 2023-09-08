import { FC } from 'react';
import { SplittedPageLayout } from '../components';
import { AddRoom, Header, RoomList } from './components';



export const WithRoomList: FC = () => {
    return (
        <SplittedPageLayout>
            <Header/>

            <AddRoom/>

            <RoomList/>
        </SplittedPageLayout>
    );
};