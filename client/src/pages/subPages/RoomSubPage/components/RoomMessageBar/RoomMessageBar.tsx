import { EntityContext } from '@components';
import { FC, useContext } from 'react';



const placeholder = 'Написать в комнату';

export const RoomMessageBar: FC = () => {
    const [chat] = useContext(EntityContext.Chat);
    const [room] = useContext(EntityContext.Room);

    return (
        <>
            {/* <MessageInputBar placeholder={placeholder}/> */}
        </>
    );
};