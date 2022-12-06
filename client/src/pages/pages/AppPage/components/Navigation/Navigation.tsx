import { Button, Icon, Separator, AddFriendModal, TopBar, OverlayContextProvider } from '@components';
import { FC } from 'react';
import { TabNavigationButton } from './components';



export const Navigation: FC = () => {
    return (
        <TopBar className='px-2 items-center'>
            <Icon 
                iconId='friend-icon'
                className='h-6 w-6 fill-icon-300 mx-2'
            /> 
    
            <h3 className='text-heading_m text-primary font-medium'>
                Друзья
            </h3>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <ul className='flex gap-4'>
                <li className='contents'>
                    <TabNavigationButton identifier='OnlineFriends'>
                        В сети
                    </TabNavigationButton>
                </li>
                
                <li className='contents'>
                    <TabNavigationButton identifier='AllFriends'>
                        Все
                    </TabNavigationButton>
                </li>

                <li className='contents'>
                    <TabNavigationButton identifier='IncomingRequests'>
                        Ожидение
                    </TabNavigationButton>
                </li>

                <li className='contents'>
                    <TabNavigationButton identifier='Blocked'>
                        Заблокированные
                    </TabNavigationButton>
                </li>
            </ul>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <OverlayContextProvider>
                {({ openOverlay }) => (
                    <>
                        <Button variant='brand' onClick={openOverlay}>
                            <>Добавить в друзья</>
                        </Button>

                        <AddFriendModal/>
                    </>
                )}
            </OverlayContextProvider>
        </TopBar>
    );
};