import { FC } from 'react';
import { ExtraStatusType, StatusType } from '@backendTypes';
import { AfkStatus, DndStatus, OfflineStatus, OnlineStatus } from './components';
import { twMerge } from 'tailwind-merge';
import { RefContextProvider, Tooltip } from '@components';




interface IUserAvatar {
    className?: string;
    avatar: string;
    username?: string;
    status?: StatusType;
    extraStatus?: ExtraStatusType;
    size?: number;
}

export const UserAvatar: FC<IUserAvatar> = ({
    className = '',
    avatar,
    username,
    status,
    extraStatus = 'default',
    size,
}) => {
    const showStatus = !!status;
    const isDefault = extraStatus === 'default';
    const classes = 'absolute bottom-0 right-0 w-1/3 h-1/3';
    const statuses = {
        online: {
            elem: <OnlineStatus className={classes}/>,
            title: 'В сети',
        },
        offline: {
            elem: <OfflineStatus className={classes}/>,
            title: 'Не в сети',
        },
        afk: {
            elem: <AfkStatus className={classes}/>,
            title: 'Неактивен',
        },
        dnd: {
            elem: <DndStatus className={classes}/>,
            title: 'Не беспокоить',
        },
        invisible: {
            elem: <OfflineStatus className={classes}/>,
            title: 'Не в сети',
        },
    };
    const currentStatus = isDefault ? statuses[status || 'offline'] : statuses[extraStatus];

    return (
        <div 
            className={twMerge(`relative flex shrink-0 ${className}`)}
            style={{ height: size, width: size }}
        >
            <svg width={size} height={size}>
                <foreignObject 
                    x={0} y={0}
                    height={size}
                    width={size}
                    mask={showStatus ? 'url(#avatar-with-status-mask)' : ''}
                >
                    <img 
                        src={avatar} 
                        alt={`${username} avatar`}
                        className='object-cover w-full rounded-full'
                    />

                    {
                        showStatus && 
                        <RefContextProvider>
                            {currentStatus.elem}

                            <Tooltip position='top'>
                                {currentStatus.title}
                            </Tooltip>
                        </RefContextProvider>
                    }
                </foreignObject>
            </svg>
        </div>
        
    );
};