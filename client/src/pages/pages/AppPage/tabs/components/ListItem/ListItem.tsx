import { ExtraStatusType, StatusType } from '@backendTypes';
import { Separator, UserAvatar } from '@components';
import { FC, ReactNode } from 'react';



interface IListItem {
    avatar: string;
    username: string;
    status?: StatusType;
    extraStatus?: ExtraStatusType;
    actionButtons: ReactNode;
    extraInfo?: string;
}

export const ListItem: FC<IListItem> = ({
    avatar,
    extraStatus,
    status,
    username,
    actionButtons,
    extraInfo,
}) => {
    return (
        <>
            <Separator spacing={4} thikness={2}/>
            
            <li 
                className='flex items-center py-2 px-2.5 rounded-lg
                hover:bg-hover focus-within:bg-hover group-1'
            >
                <UserAvatar
                    className='mr-3 h-8 w-8'
                    avatar={avatar} 
                    username={username} 
                    status={status} 
                    extraStatus={extraStatus}
                />

                <div className='mr-5 flex flex-col overflow-hidden'>
                    <span className='font-semibold text-primary overflow-hidden text-ellipsis whitespace-nowrap'>
                        {username}
                    </span>

                    {
                        extraInfo && 
                        <span className='text-xs text-secondary overflow-hidden text-ellipsis whitespace-nowrap'>
                            {extraInfo}
                        </span>
                    }
                </div>

                {actionButtons}
            </li>
        </>
    );
};