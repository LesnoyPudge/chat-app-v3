import { twClassNames } from '@utils';
import { FC } from 'react';



interface IOnlineStatus {
    className?: string;
}

const baseClassName = 'bg-status-online w-full h-full rounded-full shrink-0';

export const OnlineStatus: FC<IOnlineStatus> = ({ className }) => {
    return (
        <div className={twClassNames(baseClassName, className)}></div>
    );
};