import { twClassNames } from '@utils';
import { FC } from 'react';



interface IOfflineStatus {
    className?: string;
}

const balseClassName = 'h-full w-full fill-status-offline shrink-0';

export const OfflineStatus: FC<IOfflineStatus> = ({ className }) => {
    return (
        <svg className={twClassNames(balseClassName, className)}>
            <rect  
                height='100%'
                width='100%'
                mask='url(#offline-status-mask)'
            ></rect>
        </svg>
    );
};