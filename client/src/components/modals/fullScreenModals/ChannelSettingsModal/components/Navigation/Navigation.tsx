import { FC, useContext, useRef } from 'react';
import { Button, ChannelSettingsModalTabs, DeleteChannelModal,SpriteImage, OverlayContextProvider, Separator, TabContext, TabList , MoveFocusInside } from '@components';
import { NavigationHeading, NavigationItem } from '../../../components';
import { objectKeysToIdArray } from '@utils';
import { useKeyboardNavigation } from '@hooks';




const styles = {
    list: 'flex flex-col gap-0.5',
    button: 'group w-full',
    deleteChannelIcon: 'w-4 h-4',
};

export const Navigation: FC = () => {
    const { tabs, changeTab, isActive, tabProps } = useContext<TabContext<ChannelSettingsModalTabs>>(TabContext);
    const tabsRef = useRef(objectKeysToIdArray(tabs));
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(tabsRef);

    return (
        <div>
            <TabList
                label='Настройки канала'
                orientation='vertical'
                tabIndex={0}
                innerRef={setRoot}
            >
                <NavigationHeading>
                    <>Канал лошок111</>
                </NavigationHeading>

                <div className={styles.list}>
                    <MoveFocusInside enabled={getIsFocused(tabs.overviewTab.identifier)}>
                        <Button
                            className={styles.button}
                            isActive={isActive.overviewTab}
                            label='Обзор канала'
                            tabIndex={getTabIndex(tabs.overviewTab.identifier)}
                            {...tabProps.overviewTab}
                            onLeftClick={withFocusSet(tabs.overviewTab.identifier, changeTab.overviewTab)}
                        >
                            <NavigationItem isActive={isActive.overviewTab}>
                                <>Обзор</>
                            </NavigationItem>
                        </Button>
                    </MoveFocusInside>

                    <MoveFocusInside enabled={getIsFocused(tabs.rolesTab.identifier)}>
                        <Button
                            className={styles.button}
                            isActive={isActive.rolesTab}
                            label='Роли канала'
                            tabIndex={getTabIndex(tabs.rolesTab.identifier)}
                            {...tabProps.rolesTab}
                            onLeftClick={withFocusSet(tabs.rolesTab.identifier, changeTab.rolesTab)}
                        >
                            <NavigationItem isActive={isActive.rolesTab}>
                                <>Роли</>
                            </NavigationItem>
                        </Button>
                    </MoveFocusInside>
                </div>

                <Separator spacing={16}/>

                <NavigationHeading>
                    <>Управление участниками</>
                </NavigationHeading>

                <div className={styles.list}>
                    <MoveFocusInside enabled={getIsFocused(tabs.membersTab.identifier)}>
                        <Button
                            className={styles.button}
                            isActive={isActive.membersTab}
                            label='Участники канала'
                            tabIndex={getTabIndex(tabs.membersTab.identifier)}
                            {...tabProps.membersTab}
                            onLeftClick={withFocusSet(tabs.membersTab.identifier, changeTab.membersTab)}
                        >
                            <NavigationItem isActive={isActive.membersTab}>
                                <>Участники</>
                            </NavigationItem>
                        </Button>
                    </MoveFocusInside>

                    <MoveFocusInside enabled={getIsFocused(tabs.bannedTab.identifier)}>
                        <Button
                            className={styles.button}
                            isActive={isActive.bannedTab}
                            label='Забаненные пользователи'
                            tabIndex={getTabIndex(tabs.bannedTab.identifier)}
                            {...tabProps.bannedTab}
                            onLeftClick={withFocusSet(tabs.bannedTab.identifier, changeTab.bannedTab)}
                        >
                            <NavigationItem isActive={isActive.bannedTab}>
                                <>Баны</>
                            </NavigationItem>
                        </Button>
                    </MoveFocusInside>
                </div>
            </TabList>

            <Separator spacing={16}/>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <>
                        <Button
                            className={styles.button}
                            label='Удалить канал'
                            hasPopup='dialog'
                            isActive={isOverlayExist}
                            onLeftClick={openOverlay}
                        >
                            <NavigationItem>
                                <>Удалить канал</>

                                <SpriteImage
                                    className={styles.deleteChannelIcon}
                                    name='GARBAGE_CAN_ICON'
                                />
                            </NavigationItem>
                        </Button>

                        <DeleteChannelModal/>
                    </>
                )}
            </OverlayContextProvider>
        </div>
    );
};