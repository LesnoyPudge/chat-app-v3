import { Button,SpriteImage, Separator, AddFriendModal, TopBar, OverlayContextProvider, TabContext, TabList, List , MoveFocusInside, FocusAt, Scrollable } from '@components';
import { useKeyboardNavigation } from '@hooks';
import { Heading } from '@libs';
import { AppSubPageTabs } from '@subPages/AppSubPage';
import { objectKeys, objectKeysToIdArray, twClassNames } from '@utils';
import { FC, useContext, useRef } from 'react';




const styles = {
    wrapper : 'px-2 items-center',
    icon: 'h-6 w-6 fill-icon-300 mx-2',
    heading: 'text-heading-m text-color-primary font-medium',
    scrollableInner: 'flex',
    tabList: 'flex gap-4 shrink-0',
    button: {
        base: `px-2 py-0.5 shrink-0 rounded text-color-secondary 
        font-semibold transition-all duration-75 hover:text-color-primary 
        hover:bg-primary-active focus-visible:text-color-primary 
        focus-visible:bg-primary-active`,
        active: 'text-color-primary bg-primary-active',
    },
};

const tabListLabel = 'Выбор категории для сортировки пользователей';

export const Navigation: FC = () => {
    const { 
        changeTab, 
        isActive, 
        tabs, 
        tabProps 
    } = useContext<TabContext<AppSubPageTabs>>(TabContext);
    const tabsRef = useRef(objectKeysToIdArray(tabs));
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
    } = useKeyboardNavigation(tabsRef, undefined, { direction: 'horizontal' });

    const buttonText: Record<keyof typeof tabs, string> = {
        allFriends: 'Все',
        blocked: 'Заблокированные',
        friendRequests: 'Ожидание',
        onlineFriends: 'В сети',
    };

    return (
        <TopBar 
            className={styles.wrapper}
            withMobileButton
        >
            <SpriteImage
                className={styles.icon}
                name='FRIEND_ICON'
            />

            <Heading className={styles.heading}>
                <>Друзья</>
            </Heading>

            <Separator spacing={16} orientation='vertical' height={24}/>

            <Scrollable
                direction='horizontal'
                innerClassName={styles.scrollableInner}
                focusable
                followContentSize
                hidden
                label={tabListLabel}
            >
                <TabList
                    className={styles.tabList}
                    label={tabListLabel}
                    orientation='horizontal'
                    tabIndex={0}
                    innerRef={setRoot}
                >
                    <List list={objectKeys(tabs)}>
                        {(tabId) => (
                            <FocusAt<HTMLButtonElement> 
                                focused={getIsFocused(tabId)}
                                scrollIntoView
                                horizontal='center'
                            >
                                {({focusableRef}) => (
                                    <Button
                                        className={twClassNames(
                                            styles.button.base,
                                            { [styles.button.active]: isActive[tabId] },
                                        )}
                                        size='small'
                                        innerRef={focusableRef}
                                        tabIndex={getTabIndex(tabId)}
                                        isActive={isActive[tabId]}
                                        {...tabProps[tabId]}
                                        onLeftClick={changeTab[tabId]}
                                    >
                                        {buttonText[tabId]}
                                    </Button>
                                )}
                            </FocusAt>
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
            </Scrollable>
        </TopBar>
    );
};