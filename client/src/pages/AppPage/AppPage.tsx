import { Button, ContextMenu, PageContent, PageContentNavigation, RefContextProvider, Tooltip, TopBar } from '@components';
import { FC } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserToolBar } from './components';



export const AppPage: FC = () => {
    const navigate = useNavigate();
    return (
        <div className='flex w-full'>
            <PageContentNavigation>
                <TopBar>
                    top bar
                </TopBar>

                <div className='p-2.5 flex flex-col gap-5'>
                    PrivateMessages 1 2 3 4 5

                    <Button variant='brand' onClick={() => navigate('private-chat/1')}>
                        to private-chat 1
                    </Button>

                    <Button variant='brand' onClick={() => navigate('private-chat/2')}>
                        to private-chat 2
                    </Button>
                </div>

                
                <UserToolBar/>
                {/* AccountPanel */}
            </PageContentNavigation>

            <PageContent>
                <Outlet/>
            </PageContent>
        </div>
    );
};
