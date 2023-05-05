import { Button, Icon, Separator, AddFriendModal, TopBar, OverlayContextProvider, TabContext, TabList, List } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { Heading } from '@libs';
import { AppPageTabs } from '@pages/AppPage/AppPage';
import { objectKeys, objectKeysToIdArray, twClassNames } from '@utils';
import { FC, useContext, useRef } from 'react';
import { MoveFocusInside } from 'react-focus-lock';



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
    const tabsRef = useRef(objectKeysToIdArray(tabs));
    const {
        getIsFocused,
        getTabIndex,
        setFocusedId,
        setRoot,
        setViewportIndexes,
        withFocusSet,
    } = useKeyboardNavigation(tabsRef, undefined, { direction: 'horizontal' });

    const buttonText: Record<keyof typeof tabs, string> = {
        allFriends: 'Все',
        blocked: 'Заблокированные',
        friendRequests: 'Ожидание',
        onlineFriends: 'В сети',
    };

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

            <TabList
                className='flex gap-4'
                label='Пользователи'
                orientation='horizontal'
                tabIndex={0}
                innerRef={setRoot}
            >
                <List list={objectKeys(tabs)}>
                    {(tabId) => (
                        <MoveFocusInside disabled={!getIsFocused(tabId)}>
                            <Button
                                className={twClassNames(
                                    styles.button.base, 
                                    { [styles.button.active]: isActive[tabId] },
                                )}
                                size='small'
                                tabIndex={getTabIndex(tabId)}
                                isActive={isActive[tabId]}
                                {...tabProps[tabId]}
                                onLeftClick={changeTab[tabId]}
                            >
                                {buttonText[tabId]}
                            </Button>    
                        </MoveFocusInside>
                    )}
                </List>
            </TabList>

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