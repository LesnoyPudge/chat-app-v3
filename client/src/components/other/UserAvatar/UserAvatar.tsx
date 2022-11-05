import { FC } from 'react';
import { ExtraStatusType, StatusType } from '@backendTypes';
import { AfkStatus, DndStatus, OfflineStatus, OnlineStatus } from './components';
import { Conditional, RefContextProvider, Tooltip } from '@components';
import AutoSizer from '@oyyds/react-auto-sizer';
import { twClassNames } from '@utils';



interface IUserAvatar {
    className?: string;
    avatar: string;
    username?: string;
    status?: StatusType;
    extraStatus?: ExtraStatusType;
}

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

export const UserAvatar: FC<IUserAvatar> = ({
    className = '',
    avatar,
    username,
    status = 'offline',
    extraStatus = 'default',
}) => {
    const showStatus = !!status;
    const isDefault = extraStatus === 'default' || status === 'offline';
    const currentStatus = isDefault ? statuses[status] : statuses[extraStatus];

    const imageElement = <img 
        src={avatar} 
        alt={`${username}\`s avatar`}
        className='object-cover w-full rounded-full'
    />;

    return (
        <div className={twClassNames('relative flex shrink-0 aspect-square', className)}>
            <Conditional isRendered={!showStatus}>
                {imageElement}
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
                                {imageElement}

                                <RefContextProvider>
                                    {currentStatus.elem}
    
                                    <Tooltip position='top'>
                                        {currentStatus.title}
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