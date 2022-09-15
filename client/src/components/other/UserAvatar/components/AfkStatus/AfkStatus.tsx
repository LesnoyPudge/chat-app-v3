import { FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface IAfkStatus {
    className?: string;
}

export const AfkStatus: FC<IAfkStatus> = ({ className }) => {
    return (
        <svg className={twMerge(`h-full w-full ${className}`)}>
            <rect 
                className='h-full w-full fill-status-afk' 
                mask='url(#afk-status-mask)'
            ></rect>
        </svg>
    );
};