import { FC, useContext, useRef } from 'react';
import { Button, DeleteRoomModal, Icon, OverlayContextProvider, Separator, TabContext, TabList } from '@components';
import { RoomSettingsModalTabs } from '../../RoomSettingsModal';
import { useKeyboardNavigation } from '@hooks';
import { NavigationHeading, NavigationItem } from '../../../components';
import { MoveFocusInside } from 'react-focus-lock';
import { objectKeysToIdArray } from '@utils';



const styles = {
    list: 'flex flex-col gap-0.5',
    button: 'group w-full',
    deleteIcon: 'w-4 h-4',
};

export const Navigation: FC = () => {
    const { tabs, changeTab, isActive, tabProps } = useContext(TabContext) as TabContext<RoomSettingsModalTabs>;
    const listOfTabKeysRef = useRef(objectKeysToIdArray(tabs));
    const { setRoot, getTabIndex, getIsFocused } = useKeyboardNavigation(listOfTabKeysRef, null, {
        direction: 'vertical',
    });

    return (
        <div>
            <TabList 
                label='Настройки комнаты' 
                orientation='vertical'
                innerRef={setRoot}
            >
                <NavigationHeading>
                    <>Room name</>
                </NavigationHeading>

                <div className={styles.list}>
                    <MoveFocusInside disabled={!getIsFocused(tabs.overviewTab.identifier)}>
                        <Button
                            className={styles.button}
                            isActive={isActive.overviewTab}
                            label='Обзор комнаты'
                            tabIndex={getTabIndex(tabs.overviewTab.identifier)}
                            {...tabProps.overviewTab}
                            onLeftClick={changeTab.overviewTab}
                        >
                            <NavigationItem isActive={isActive.overviewTab}>
                                <>Обзор</>
                            </NavigationItem>
                        </Button>
                    </MoveFocusInside>

                    <MoveFocusInside disabled={!getIsFocused(tabs.permissionsTab.identifier)}>
                        <Button
                            className={styles.button}
                            isActive={isActive.permissionsTab}
                            label='Права доступа'
                            tabIndex={getTabIndex(tabs.permissionsTab.identifier)}
                            {...tabProps.permissionsTab}
                            onLeftClick={changeTab.permissionsTab}
                        >
                            <NavigationItem isActive={isActive.permissionsTab}>
                                <>Права доступа</>
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
                            label='Удалить комнату'
                            hasPopup='dialog'
                            isActive={isOverlayExist}
                            onLeftClick={openOverlay}
                        >
                            <NavigationItem>
                                <>Удалить комнату</>

                                <Icon
                                    className={styles.deleteIcon}
                                    iconId='garbage-can-icon'
                                />
                            </NavigationItem>
                        </Button>

                        <DeleteRoomModal/>
                    </>
                )}
            </OverlayContextProvider>
        </div>
    );
};