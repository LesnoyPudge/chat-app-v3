import { Button, Icon, Separator, AddFriendModal, TopBar, OverlayContextProvider, TabContext, TabList, ArrowFocusContextProvider, ArrowFocusItem } from '@components';
import { Heading } from '@libs';
import { AppPageTabs } from '@pages/AppPage/AppPage';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';



const styles = {
    button: {
        base: `px-2 py-0.5 shrink-0 rounded text-color-secondary font-semibold transition-all 
        duration-75 hover:text-color-primary hover:bg-primary-active 
        focus-visible:text-color-primary focus-visible:bg-primary-active`,
        active: 'text-color-primary bg-primary-active',
    },
};

export const Navigation: FC = () => {
    const { changeTab, isActive, tabs, tabProps } = useContext(TabContext) as TabContext<AppPageTabs>;

    return (
        <TopBar className='px-2 items-center'>
            <Icon
                className='h-6 w-6 fill-icon-300 mx-2'
                iconId='friend-icon'
            /> 
    
            <Heading className='text-heading-m text-color-primary font-medium'>
                <>Друзья</>
            </Heading>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <ArrowFocusContextProvider list={tabs} orientation='horizontal'>
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
                                tabIndex={tabIndex}
                                isActive={isActive.onlineFriends}
                                {...tabProps.onlineFriends}
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
                                tabIndex={tabIndex}
                                isActive={isActive.allFriends}
                                {...tabProps.allFriends}
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
                                tabIndex={tabIndex}
                                isActive={isActive.friendRequests}
                                {...tabProps.friendRequests}
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
                                tabIndex={tabIndex}
                                isActive={isActive.blocked}
                                {...tabProps.blocked}
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