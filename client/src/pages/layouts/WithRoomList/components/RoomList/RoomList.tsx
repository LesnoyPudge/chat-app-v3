import { Scrollable, EntityContext, EntityContextProvider, EntityContextHelpers, Memo, Placeholder } from '@components';
import { useKeyboardNavigation, useLatest } from '@hooks';
import { idArrayToObjectsWithId } from '@utils';
import { FC, useContext } from 'react';
import { ViewportList } from 'react-viewport-list';
import { LoadedRoomItem } from './components';



const styles = {
    wrapper: 'mt-4',
    list: 'flex flex-col gap-1',
    placeholder: 'h-9 bg-primary-hover cursor-not-allowed rounded-md',
};

export const RoomList: FC = () => {
    const [channel] = useContext(EntityContext.Channel);
    const roomListRef = useLatest(idArrayToObjectsWithId(channel?.rooms ?? []));

    const {
        setRoot,
        withFocusSet,
        getIsFocused,
        getTabIndex,
        setViewportIndexes,
    } = useKeyboardNavigation(roomListRef, undefined, {
        virtualized: true,
        initialFocusableId: roomListRef.current.at(0)?.id,
    });

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
                    items={channel?.rooms}
                    onViewportIndexesChange={setViewportIndexes}
                    withCache
                    initialPrerender={30}
                    overscan={3}
                >
                    {(roomId) => {
                        return (
                            <li key={roomId}>
                                <EntityContextProvider.Room id={roomId}>
                                    <EntityContextHelpers.Room.Loaded>
                                        {(room) => (
                                            <Memo>
                                                <LoadedRoomItem
                                                    room={room}
                                                    withFocusSet={withFocusSet}
                                                    getIsFocused={getIsFocused}
                                                    getTabIndex={getTabIndex}
                                                />
                                            </Memo>
                                        )}
                                    </EntityContextHelpers.Room.Loaded>

                                    <EntityContextHelpers.Room.Loading>
                                        <Placeholder
                                            className={styles.placeholder}
                                            title='Загрузка комнаты...'
                                        />
                                    </EntityContextHelpers.Room.Loading>
                                </EntityContextProvider.Room>
                            </li>
                        );
                    }}
                </ViewportList>
            </ul>
        </Scrollable>
    );
};