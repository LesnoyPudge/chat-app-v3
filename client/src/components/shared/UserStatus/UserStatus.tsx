import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { SpriteImage } from '@components';
import { IMAGES } from '@generated';
import { Entities } from '@shared';
import { twClassNames } from '@utils';



type Statuses = Entities.User.Status | Entities.User.ExtraStatus;

interface UserStatus extends PropsWithClassName {
    status: Entities.User.Status;
    extraStatus?: Entities.User.ExtraStatus;
}

const statusNames = {
    afk: IMAGES.SPRITE.STATUS_AFK.NAME,
    dnd: IMAGES.SPRITE.STATUS_DND.NAME,
    invisible: IMAGES.SPRITE.STATUS_OFFLINE.NAME,
    offline: IMAGES.SPRITE.STATUS_OFFLINE.NAME,
    online: IMAGES.SPRITE.STATUS_ONLINE.NAME,
    default: IMAGES.SPRITE.STATUS_ONLINE.NAME,
} satisfies Record<Statuses, string>;

const styles = {
    online: 'fill-status-online',
    afk: 'fill-status-afk',
    default: 'fill-status-online',
    dnd: 'fill-status-dnd',
    invisible: 'fill-status-offline',
    offline: 'fill-status-offline',
} satisfies Record<Statuses, string>;

export const UserStatus: FC<UserStatus> = ({
    className = '',
    status,
    extraStatus = 'default',
}) => {
    const statusToShow: Statuses = (
        status === 'offline'
            ? status
            : extraStatus
    );

    console.log(`statusToShow: ${statusToShow}, status: ${status}, extraStatus: ${extraStatus}, ${statusNames[statusToShow]}`);

    return (
        <SpriteImage
            className={twClassNames(styles[statusToShow], className)}
            name={statusNames[statusToShow]}
        />
    );
};