import { FC } from 'react';
import { SplitedPageLayout } from '../components';
import { Header, PrivateChatList } from './components';



export const WithPrivateChatList: FC = () => {
    return (
        <SplitedPageLayout>
            <Header/>

            <PrivateChatList/>
        </SplitedPageLayout>
    );
};