import { Chat, EntityContextProvider, EntityContext } from '@components';
import { FC, useContext, useEffect } from 'react';
import { Header, RoomMessageBar } from './components';
import { localStorageApi } from '@utils';
import { ChatV2, ChatV3 } from 'src/components/shared/ChatV2/ChatV2';



export const RoomSubPage: FC = () => {
    const [room] = useContext(EntityContext.Room);

    useEffect(() => {
        if (!room?.id) return;
        if (room.type !== 'text') return;

        const oldRecord = localStorageApi.get('lastVisitedTextRooms');

        if (oldRecord) {
            oldRecord[room.channel] = room.id;
            localStorageApi.set('lastVisitedTextRooms', oldRecord);
            return;
        }

        localStorageApi.set('lastVisitedTextRooms', {
            [room.channel]: room.id,
        });
    }, [room?.channel, room?.id, room?.type]);

    return (
        <>
            <Header/>

            <EntityContextProvider.Chat id={room?.chat}>
                {/* <Chat/>

                <RoomMessageBar/> */}

                <ChatV3.Room/>
            </EntityContextProvider.Chat>
        </>
    );
};