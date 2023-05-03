import { FC } from 'react';
import { SplittedPageLayout } from '../components';
import { Header, RoomList } from './components';



export const WithRoomList: FC = () => {
    return (
        <SplittedPageLayout>
            <Header/>

            <RoomList/>
        </SplittedPageLayout>
    );
};