import { Button, MoveFocusInside, OverlayContextProvider, Ref, RoomSettingsModal, SpriteImage, Tooltip } from '@components';
import { IMAGES } from '@generated';
import { useKeyboardNavigation, useNavigator } from '@hooks';
import { SliceEntityState } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



type LoadedRoomItem = {
    room: SliceEntityState.Room;
} & Pick<
    ReturnType<typeof useKeyboardNavigation>,
    'withFocusSet' | 'getIsFocused' | 'getTabIndex'
>

const styles = {
    item: {
        base: `relative min-h-[36px] flex items-center gap-1.5 p-1.5 rounded-md 
        hover:bg-primary-hover focus-within:bg-primary-hover group/item`,
        selected: 'bg-primary-selected',
    },
    navigationButton: 'absolute inset-0',
    roomTypeIcon: 'h-5 w-5 fill-icon-300',
    name: {
        base: `font-medium text-color-muted truncate
        group-focus-within/item:text-color-primary group-hover/item:text-color-primary`,
        selected: 'text-color-primary',
    },
    actionButton: {
        base: `shrink-0 ml-auto h-4 w-0 opacity-0 z-0
        group-focus-within/item:opacity-100 group-hover/item:opacity-100 group/action
        group-focus-within/item:w-4 group-hover/item:w-4`,
        selected: 'opacity-100 w-4',
    },
    actionIcon: `w-full h-full fill-icon-300 group-hover/action:fill-icon-100 
    group-focus-visible/action:fill-icon-100`,
};

export const LoadedRoomItem: FC<LoadedRoomItem> = ({
    room,
    getIsFocused,
    getTabIndex,
    withFocusSet,
}) => {
    const { navigateTo, myLocationIs } = useNavigator();
    const handleNavigation = () => handleRoomNavigation(room.id);

    const handleRoomNavigation = (roomId: string) => {
        navigateTo.room(room.channel, roomId);
    };

    const getIsActive = (roomId: string) => {
        return myLocationIs.room(room.channel, roomId);
    };

    const isRoomActive = getIsActive(room.id);
    const navigationLabel = `Перейти к комнате ${room.name}`;
    const settingsLabel = `Настройки комнаты ${room.name}`;
    const tabIndex = getTabIndex(room.id);
    const isFocused = getIsFocused(room.id);

    const roomTypeIconId = (
        room.type === 'voice'
            ? IMAGES.SPRITE.VOICE_ROOM_ICON.NAME
            : IMAGES.SPRITE.TEXT_ROOM_ICON.NAME
    );

    return (
        <MoveFocusInside
            className={twClassNames(
                styles.item.base,
                { [styles.item.selected]: isRoomActive, [String(isRoomActive)]: isRoomActive },
            )}
            enabled={isFocused}
        >
            <Button
                className={styles.navigationButton}
                label={navigationLabel}
                tabIndex={tabIndex}
                onLeftClick={withFocusSet(room.id, handleNavigation)}
                onAnyClick={withFocusSet(room.id)}
            ></Button>

            <SpriteImage
                className={styles.roomTypeIcon}
                name={roomTypeIconId}
            />

            <span className={twClassNames(
                styles.name.base,
                { [styles.name.selected]: isRoomActive },
            )}>
                {room.name}
            </span>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <Ref<HTMLButtonElement>>
                        {(ref) => (
                            <>
                                <Button
                                    className={twClassNames(
                                        styles.actionButton.base,
                                        { [styles.actionButton.selected]: isRoomActive },
                                    )}
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

                                <RoomSettingsModal/>

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
        </MoveFocusInside>
    );
};