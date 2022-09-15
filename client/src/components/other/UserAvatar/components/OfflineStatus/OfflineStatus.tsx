import { FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface IOfflineStatus {
    className?: string;
}

export const OfflineStatus: FC<IOfflineStatus> = ({ className }) => {
    return (
        <svg className={twMerge(`h-full w-full fill-status-offline ${className}`)}>
            <rect  
                mask='url(#offline-status-mask)'
                className='h-full w-full'
            ></rect>
        </svg>
    );
};