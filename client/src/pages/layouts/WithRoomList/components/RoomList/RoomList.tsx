import { Button,SpriteImage, OverlayContextProvider, Ref, RoomSettingsModal, Scrollable, Tooltip , MoveFocusInside } from '@components';
import { IMAGES } from '@generated';
import { useKeyboardNavigation, useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { FC, useRef } from 'react';

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
        withFocusSet,
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
                        const roomTypeIconId = (
                            room.type === 'voice'
                                ? IMAGES.SPRITE.VOICE_ROOM_ICON.NAME
                                : IMAGES.SPRITE.TEXT_ROOM_ICON.NAME
                        );
                        const isRoomActive = getIsActive(room.id);
                        const navigationLabel = `Перейти к комнате ${room.name}`;
                        const settingsLabel = `Настройки комнаты ${room.name}`;
                        const tabIndex = getTabIndex(room.id);
                        const isFocused = getIsFocused(room.id);

                        const handleNavigation = () => handleRoomNavigation(room.id);

                        return (
                            <MoveFocusInside
                                enabled={isFocused}
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
                                        onLeftClick={withFocusSet(room.id, handleNavigation)}
                                    ></Button>

                                    <SpriteImage
                                        className={styles.roomTypeIcon}
                                        name={roomTypeIconId}
                                    />

                                    <span className={styles.name}>
                                        {room.name} {room.name}{room.name}{room.name}{room.name}{room.name}
                                    </span>

                                    <OverlayContextProvider>
                                        {({ openOverlay, isOverlayExist }) => (
                                            <Ref<HTMLButtonElement>>
                                                {(ref) => (
                                                    <>
                                                        <Button
                                                            className={styles.actionButton}
                                                            tabIndex={tabIndex}
                                                            isActive={isOverlayExist}
                                                            hasPopup='dialog'
                                                            label={settingsLabel}
                                                            innerRef={ref}
                                                            onLeftClick={withFocusSet(room.id, openOverlay)}
                                                        >
                                                            <SpriteImage
                                                                className={styles.actionIcon}
                                                                name='SETTINGS_GEAR'
                                                            />
                                                        </Button>

                                                        <RoomSettingsModal roomId={room.id}/>

                                                        <Tooltip
                                                            preferredAlignment='top'
                                                            spacing={5}
                                                            leaderElementRef={ref}
                                                        >
                                                            <>Настроить комнату</>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Ref>
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