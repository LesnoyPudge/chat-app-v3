import { ExtraStatusType, StatusType } from '@backendTypes';
import { FC } from 'react';
import { AfkStatus, DndStatus, OfflineStatus, OnlineStatus } from './components';



interface IUserStatus {
    className?: string;
    status: StatusType;
    extraStatus?: ExtraStatusType;
}

// eslint-disable-next-line react/display-name
export const UserStatus: FC<IUserStatus> = ({
    className = '',
    status,
    extraStatus = 'default',
}) => {
    const onlineStatuses = {
        default: <OnlineStatus className={className}/>,
        afk: <AfkStatus className={className}/>,
        dnd: <DndStatus className={className}/>,
        invisible: <OfflineStatus className={className}/>,
    };

    const isOffline = status === 'offline';
    const statusToShow = isOffline 
        ? <OfflineStatus className={className}/> 
        : onlineStatuses[extraStatus];
    
    return <>{statusToShow}</>;
};