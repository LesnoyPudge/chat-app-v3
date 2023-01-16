import { Button, Icon, Separator, AddFriendModal, TopBar, OverlayContextProvider } from '@components';
import { Heading } from '@libs';
import { FC } from 'react';
import { TabNavigationButton } from './components';



export const Navigation: FC = () => {
    return (
        <TopBar className='px-2 items-center'>
            <Icon
                className='h-6 w-6 fill-icon-300 mx-2'
                iconId='friend-icon'
            /> 
    
            <Heading className='text-heading-m text-primary font-medium'>
                <>Друзья</>
            </Heading>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <ul className='flex gap-4'>
                <li>
                    <TabNavigationButton identifier='OnlineFriends'>
                        В сети
                    </TabNavigationButton>
                </li>
                
                <li>
                    <TabNavigationButton identifier='AllFriends'>
                        Все
                    </TabNavigationButton>
                </li>

                <li>
                    <TabNavigationButton identifier='IncomingRequests'>
                        Ожидение
                    </TabNavigationButton>
                </li>

                <li>
                    <TabNavigationButton identifier='Blocked'>
                        Заблокированные
                    </TabNavigationButton>
                </li>
            </ul>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <>
                        <Button 
                            stylingPreset='brand'
                            hasPopup='dialog'
                            expanded={isOverlayExist}
                            label='Добавить друзей'
                            onLeftClick={openOverlay}
                        >
                            <>Добавить в друзья</>
                        </Button>

                        <AddFriendModal/>
                    </>
                )}
            </OverlayContextProvider>
        </TopBar>
    );
};