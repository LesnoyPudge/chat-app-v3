import { FC } from 'react';
import { SplittedPageLayout } from '../components';
import { Header, PrivateChatList } from './components';



export const WithPrivateChatList: FC = () => {
    return (
        <SplittedPageLayout>
            <Header/>

            <PrivateChatList/>
        </SplittedPageLayout>
    );
};