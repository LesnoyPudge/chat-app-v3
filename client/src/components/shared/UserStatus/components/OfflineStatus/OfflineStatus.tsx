import { twClassNames } from '@utils';
import { FC } from 'react';



interface OfflineStatus {
    className?: string;
}

const balseClassName = 'h-full w-full fill-status-offline shrink-0';

export const OfflineStatus: FC<OfflineStatus> = ({ className }) => {
    return (
        <svg className={twClassNames(balseClassName, className)} tabIndex={-1}>
            <rect  
                height='100%'
                width='100%'
                mask='url(#offline-status-mask)'
            ></rect>
        </svg>
    );
};