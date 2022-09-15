import { Button, Icon, ITab, ITabContext, Separator, TabContex, TabContexProvider, TopBar } from '@components';
import { FC, PropsWithChildren, useContext } from 'react';
import { AllFriends, OnlineFriends, IncomingRequests, Blocked } from './tabs';



const mockTabs = [
    { identifier: 'OnlineFriends', tab: <OnlineFriends/> },
    { identifier: 'AllFriends', tab: <AllFriends/> },
    { identifier: 'IncomingRequests', tab: <IncomingRequests/> },
    { identifier: 'Blocked', tab: <Blocked/> },
] as ITab[];

export const FriendsPage: FC = () => {
    return (
        <TabContexProvider tabs={mockTabs}>
            {({ currentTab }) => (
                <>
                    <TopBar className='px-2 items-center'>
                        <Icon 
                            iconId='friend-icon' 
                            height={24} 
                            width={24}
                            className='fill-icon-300 mx-2'
                        /> 
                
                        <h3 className='text-heading_m text-primary font-medium'>
                                Друзья
                        </h3>

                        <Separator spacing={16} orientation='vertical' height={24}/>

                        <TabNavigationButton identifier='OnlineFriends'>
                                В сети
                        </TabNavigationButton>

                        <TabNavigationButton identifier='AllFriends'>
                                Все
                        </TabNavigationButton>

                        <TabNavigationButton identifier='IncomingRequests'>
                                Ожидение
                        </TabNavigationButton>

                        <TabNavigationButton identifier='Blocked'>
                                Заблокированные
                        </TabNavigationButton>

                        <Button variant='brand'>
                                Добавить в друзья
                        </Button>
                    </TopBar>

                    <div className='flex flex-col h-full'>
                        {currentTab.tab}
                    </div>
                </>
            )}
        </TabContexProvider>
    );
};

interface ITabNavigationButton extends PropsWithChildren {
    identifier: 'OnlineFriends' | 'AllFriends' | 'Blocked' | 'IncomingRequests';
}

const TabNavigationButton: FC<ITabNavigationButton> = ({ children, identifier }) => {
    const { changeTab, currentTab } = useContext(TabContex) as ITabContext;

    return (
        <Button
            isActive={identifier === currentTab.identifier}
            onClick={() => changeTab(identifier)}
        >
            {children}
        </Button>
    );
};