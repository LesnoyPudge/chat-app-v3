import { FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface IOnlineStatus {
    className?: string;
}

export const OnlineStatus: FC<IOnlineStatus> = ({ className }) => {
    return (
        <div className={twMerge(`bg-status-online w-full h-full rounded-full ${className}`)}></div>
    );
};