import { FC, useContext, useRef } from 'react';
import { Button, DeleteRoomModal,SpriteImage, OverlayContextProvider, Separator, TabContext, TabList , MoveFocusInside } from '@components';
import { RoomSettingsModalTabs } from '../../RoomSettingsModal';
import { useKeyboardNavigation } from '@hooks';
import { NavigationHeading, NavigationItem } from '../../../components';

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
                    <MoveFocusInside enabled={getIsFocused(tabs.overviewTab.identifier)}>
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

                                <SpriteImage
                                    className={styles.deleteIcon}
                                    name='GARBAGE_CAN_ICON'
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