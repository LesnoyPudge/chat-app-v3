import { PageContent, PageContentNavigation, TopBar } from '@components';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { PrivateChatList, UserToolBar } from './components';



export const AppPage: FC = () => {
    
    return (
        <div className='flex w-full'>
            <PageContentNavigation>
                <TopBar>
                    top bar
                </TopBar>

                <PrivateChatList/>
                
                <UserToolBar/>
            </PageContentNavigation>

            <PageContent>
                <Outlet/>
            </PageContent>
        </div>
    );
};
