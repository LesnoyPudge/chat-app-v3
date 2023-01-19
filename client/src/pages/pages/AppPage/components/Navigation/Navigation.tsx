import { Button, Icon, Separator, AddFriendModal, TopBar, OverlayContextProvider, TabContext, TabList } from '@components';
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
    console.log(isActive);
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

            <TabList
                className='flex gap-4'
                label='Пользователи'
            >
                <Button
                    className={twClassNames(
                        styles.button.base, 
                        { [styles.button.active]: isActive.onlineFriends },
                    )}
                    role='tab'
                    controls={tabs.onlineFriends.identifier}
                    isActive={isActive.onlineFriends}
                    onLeftClick={changeTab.onlineFriends}
                >
                    <>В сети</>
                </Button>

                <Button
                    className={twClassNames(
                        styles.button.base, 
                        { [styles.button.active]: isActive.allFriends },
                    )}
                    role='tab'
                    controls={tabs.allFriends.identifier}
                    isActive={isActive.allFriends}
                    onLeftClick={changeTab.allFriends}
                >
                    <>Все</>
                </Button>

                <Button
                    className={twClassNames(
                        styles.button.base, 
                        { [styles.button.active]: isActive.incomingRequests },
                    )}
                    role='tab'
                    controls={tabs.incomingRequests.identifier}
                    isActive={isActive.incomingRequests}
                    onLeftClick={changeTab.incomingRequests}
                >
                    <>Ожидение</>
                </Button>

                <Button
                    className={twClassNames(
                        styles.button.base, 
                        { [styles.button.active]: isActive.blocked },
                    )}
                    role='tab'
                    controls={tabs.blocked.identifier}
                    isActive={isActive.blocked}
                    onLeftClick={changeTab.blocked}
                >
                    <>Заблокированные</>
                </Button>
            </TabList>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <>
                        <Button 
                            stylingPreset='brand'
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