import { Button, Icon, Separator, AddFriendModal, TopBar, OverlayContextProvider, TabContext, TabList, ArrowFocusContextProvider, ArrowFocusItem } from '@components';
import { Heading } from '@libs';
import { AppPageTabs } from '@pages/AppPage/AppPage';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';



const styles = {
    button: {
        base: `px-2 py-0.5 shrink-0 rounded text-secondary font-semibold transition-all 
        duration-75 hover:text-primary hover:bg-active 
        focus-visible:text-primary focus-visible:bg-active`,
        active: 'text-primary bg-active',
    },
};

export const Navigation: FC = () => {
    const { changeTab, isActive, tabs } = useContext(TabContext) as TabContext<AppPageTabs>;

    const tabList = [
        { id: tabs.onlineFriends.identifier },
        { id: tabs.allFriends.identifier },
        { id: tabs.friendRequests.identifier },
        { id: tabs.blocked.identifier },
    ];

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

            <ArrowFocusContextProvider list={tabList} direction='horizontal'>
                <TabList
                    className='flex gap-4'
                    label='Пользователи'
                >
                    <ArrowFocusItem id={tabs.onlineFriends.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                className={twClassNames(
                                    styles.button.base, 
                                    { [styles.button.active]: isActive.onlineFriends },
                                )}
                                size='small'
                                role='tab'
                                tabIndex={tabIndex}
                                controls={tabs.onlineFriends.identifier}
                                isActive={isActive.onlineFriends}
                                onLeftClick={changeTab.onlineFriends}
                            >
                                <>В сети</>
                            </Button>
                        )}
                    </ArrowFocusItem>

                    <ArrowFocusItem id={tabs.allFriends.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                className={twClassNames(
                                    styles.button.base, 
                                    { [styles.button.active]: isActive.allFriends },
                                )}
                                size='small'
                                role='tab'
                                tabIndex={tabIndex}
                                controls={tabs.allFriends.identifier}
                                isActive={isActive.allFriends}
                                onLeftClick={changeTab.allFriends}
                            >
                                <>Все</>
                            </Button>
                        )}
                    </ArrowFocusItem>

                    <ArrowFocusItem id={tabs.friendRequests.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                className={twClassNames(
                                    styles.button.base, 
                                    { [styles.button.active]: isActive.friendRequests },
                                )}
                                size='small'
                                role='tab'
                                tabIndex={tabIndex}
                                controls={tabs.friendRequests.identifier}
                                isActive={isActive.friendRequests}
                                onLeftClick={changeTab.friendRequests}
                            >
                                <>Ожидение</>
                            </Button>
                        )}
                    </ArrowFocusItem>

                    <ArrowFocusItem id={tabs.blocked.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                className={twClassNames(
                                    styles.button.base, 
                                    { [styles.button.active]: isActive.blocked },
                                )}
                                size='small'
                                role='tab'
                                tabIndex={tabIndex}
                                controls={tabs.blocked.identifier}
                                isActive={isActive.blocked}
                                onLeftClick={changeTab.blocked}
                            >
                                <>Заблокированные</>
                            </Button>
                        )}
                    </ArrowFocusItem>
                </TabList>
            </ArrowFocusContextProvider>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <>
                        <Button 
                            stylingPreset='brand'
                            size='small'
                            hasPopup='dialog'
                            isActive={isOverlayExist}
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