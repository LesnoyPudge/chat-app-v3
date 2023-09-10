import { EntityContext, SpriteImage, TopBar } from '@components';
import { IMAGES } from '@generated';
import { Heading } from '@libs';
import { SliceEntityState } from '@types';
import { getTextFallback } from '@utils';
import { FC, useContext } from 'react';



const styles = {
    wrapper: 'px-4',
    icon: 'h-6 w-6 fill-icon-300',
    heading: 'ml-2 text-color-primary font-bold truncated',
};

const getSpriteName = (type: SliceEntityState.Room['type']) => {
    return (
        type === 'text'
            ? IMAGES.SPRITE.TEXT_ROOM_ICON.NAME
            : IMAGES.SPRITE.VOICE_ROOM_ICON.NAME
    );
};

export const Header: FC = () => {
    const [room] = useContext(EntityContext.Room);
    const roomLabel = (
        room?.name
            ? `Комната ${room.name}`
            : getTextFallback(undefined, 'Загрузка комнаты...')
    );

    return (
        <TopBar className={styles.wrapper}>
            <If condition={!!room}>
                <SpriteImage
                    className={styles.icon}
                    name={getSpriteName(room!.type)}
                />
            </If>

            <Heading className={styles.heading}>
                {roomLabel}
            </Heading>
        </TopBar>
    );
};