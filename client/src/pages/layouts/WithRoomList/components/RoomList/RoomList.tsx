import { Button, Icon, OverlayContextProvider, RefContextProvider, RoomSettingsModal, Scrollable, Tooltip } from '@components';
import { useKeyboardNavigation, useNavigator } from '@hooks';
import { conditional, twClassNames } from '@utils';
import { FC, useRef } from 'react';
import { MoveFocusInside } from 'react-focus-lock';
import { ViewportList } from 'react-viewport-list';



interface Room {
    id: string;
    name: string;
    type: 'voice' | 'text';
}

const rooms: Room[] = Array(150).fill(null).map((_, i) => ({
    id: String(i),
    name: `room ${i}`,
    type: 'text',
} satisfies Room));

const styles = {
    wrapper: 'mt-4',
    list: 'flex flex-col gap-1',
    item: {
        base: `relative flex items-center gap-1.5 p-1.5 rounded-md 
        hover:bg-primary-hover focus-within:bg-primary-hover group/item`,
        selected: 'bg-primary-selected',
    },
    navigationButton: 'absolute inset-0',
    roomTypeIcon: 'h-5 w-5 fill-icon-300',
    name: `font-medium text-color-muted truncate
    group-focus-within/item:text-color-primary group-hover/item:text-color-primary`,
    actionButton: `shrink-0 ml-auto h-4 w-0 opacity-0 
    group-focus-within/item:opacity-100 group-hover/item:opacity-100 group/action
    group-focus-within/item:w-4 group-hover/item:w-4`,
    actionIcon: `w-full h-full fill-icon-300 group-hover/action:fill-icon-100 
    group-focus-visible/action:fill-icon-100`,
};

export const RoomList: FC = () => {
    const { params, navigateTo, myLocationIs } = useNavigator();

    const roomListRef = useRef(rooms);
    const { 
        setRoot, 
        setFocusedId, 
        getIsFocused, 
        getTabIndex,
        setViewportIndexes,
    } = useKeyboardNavigation(roomListRef, undefined, {
        virtualized: true,
    });

    const handleRoomNavigation = (roomId: string) => {                  
        if (!params.channelId) return;
        navigateTo.room(params.channelId, roomId);
    };

    const getIsActive = (roomId: string) => {
        if (!params.channelId) return;
        return myLocationIs.room(params.channelId, roomId);
    };

    return (
        <Scrollable 
            className={styles.wrapper} 
            label='Комнаты'
            withOppositeGutter
            small
            focusable
            autoHide
        >
            <ul 
                className={styles.list}
                tabIndex={0}
                aria-label='Список комнат'
                ref={setRoot}
            >
                <ViewportList 
                    items={rooms}
                    onViewportIndexesChange={setViewportIndexes}
                    withCache
                    initialPrerender={30}
                    overscan={3}
                >
                    {(room) => {
                        const roomTypeIconId = conditional(
                            'voice-room-icon', 
                            'text-room-icon', 
                            room.type === 'voice',
                        );
                        const isRoomActive = getIsActive(room.id);
                        const navigationLabel = `Перейти к комнате ${room.name}`;
                        const settingsLabel = `Настройки комнаты ${room.name}`;
                        const tabIndex = getTabIndex(room.id);
                        const isFocused = getIsFocused(room.id);
                
                        const handleNavigation = () => handleRoomNavigation(room.id);
                        const setFocusedIdOnClick = (cb: CallableFunction) => {
                            return () => {
                                setFocusedId(room.id);
                                cb();
                            };
                        };
                        
                        return (
                            <MoveFocusInside 
                                disabled={!isFocused}
                                key={room.id}
                            >
                                <li 
                                    className={twClassNames(
                                        styles.item.base,
                                        { [styles.item.selected]: isRoomActive },
                                    )}
                                >
                                    <Button
                                        className={styles.navigationButton}
                                        label={navigationLabel}
                                        tabIndex={tabIndex}
                                        onLeftClick={setFocusedIdOnClick(handleNavigation)}
                                    ></Button>
        
                                    <Icon
                                        className={styles.roomTypeIcon} 
                                        iconId={roomTypeIconId}
                                    />
        
                                    <span className={styles.name}>
                                        {room.name} {room.name}{room.name}{room.name}{room.name}{room.name}
                                    </span>
        
                                    <OverlayContextProvider>
                                        {({ openOverlay, isOverlayExist }) => (
                                            <RefContextProvider>
                                                <Button
                                                    className={styles.actionButton}
                                                    tabIndex={tabIndex}
                                                    isActive={isOverlayExist}
                                                    hasPopup='dialog'
                                                    label={settingsLabel}
                                                    onLeftClick={setFocusedIdOnClick(openOverlay)}
                                                >
                                                    <Icon
                                                        className={styles.actionIcon}
                                                        iconId='settings-gear'
                                                    />
                                                </Button>
        
                                                <RoomSettingsModal roomId={room.id}/>
        
                                                <Tooltip 
                                                    preferredAlignment='top'
                                                    spacing={5}
                                                >
                                                    <>Настроить комнату</>
                                                </Tooltip>
                                            </RefContextProvider>
                                        )}
                                    </OverlayContextProvider>
                                </li>
                            </MoveFocusInside>
                        );
                    }}
                </ViewportList>
            </ul>
        </Scrollable>
    );
};