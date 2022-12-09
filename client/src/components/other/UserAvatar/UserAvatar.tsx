import { FC } from 'react';
import { ExtraStatusType, StatusType } from '@backendTypes';
import { Conditional, RefContextProvider, Tooltip, UserStatus, Image } from '@components';
import AutoSizer from '@oyyds/react-auto-sizer';
import { twClassNames } from '@utils';
import { PropsWithClassName } from '@types';



interface IUserAvatar extends PropsWithClassName {
    statusClassName?: string;
    avatar: string;
    username?: string;
    status?: StatusType;
    extraStatus?: ExtraStatusType;
}

const statusTitles = {
    default: 'В сети',
    offline: 'Не в сети',
    invisible: 'Не в сети',
    afk: 'Неактивен',
    dnd: 'Не беспокоить',
};

const styles = {
    wrapper: 'relative flex shrink-0 aspect-square overflow-hidden',
    avatar: 'object-cover w-full rounded-full',
    status: 'absolute bottom-0 right-0 w-1/3 h-1/3',
};

export const UserAvatar: FC<IUserAvatar> = ({
    className = '',
    statusClassName = '',
    avatar,
    username,
    status,
    extraStatus = 'default',
}) => {
    const showStatus = !!status;
    const isOffline = status === 'offline';
    const statusTitle = isOffline ? statusTitles[status] : statusTitles[extraStatus];
    const alt = `${username}\`s avatar`;

    const avatarElement = <Image
        className={styles.avatar}
        src={avatar}
        alt={alt}
    />;

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <Conditional isRendered={!showStatus}>
                {avatarElement}
            </Conditional>

            <Conditional isRendered={showStatus}>
                <AutoSizer>
                    {({ height, width }) => (
                        <svg width={width} height={height}>
                            <foreignObject
                                x={0} y={0}
                                height={height}
                                width={width}
                                mask='url(#avatar-with-status-mask)'
                            >
                                {avatarElement}

                                <RefContextProvider>
                                    <UserStatus 
                                        className={twClassNames(styles.status, statusClassName)}
                                        status={status!} 
                                        extraStatus={extraStatus}
                                    />
    
                                    <Tooltip preferredAligment='top'>
                                        {statusTitle}
                                    </Tooltip>
                                </RefContextProvider>
                            </foreignObject>
                        </svg>
                    )}
                </AutoSizer>
            </Conditional>
        </div>
    );
};