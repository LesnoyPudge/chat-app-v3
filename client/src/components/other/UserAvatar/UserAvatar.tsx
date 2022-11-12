import { FC } from 'react';
import { ExtraStatusType, StatusType } from '@backendTypes';
import { Conditional, RefContextProvider, Tooltip, UserStatus } from '@components';
import AutoSizer from '@oyyds/react-auto-sizer';
import { twClassNames } from '@utils';



interface IUserAvatar {
    className?: string;
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

export const UserAvatar: FC<IUserAvatar> = ({
    className = '',
    avatar,
    username,
    status,
    extraStatus = 'default',
}) => {
    const showStatus = !!status;
    const isOffline = status === 'offline';
    const statusTitle = isOffline ? statusTitles[status] : statusTitles[extraStatus];

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
                                    <UserStatus 
                                        className='absolute bottom-0 right-0 w-1/3 h-1/3'
                                        status={status!} 
                                        extraStatus={extraStatus}
                                    />
    
                                    <Tooltip position='top'>
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