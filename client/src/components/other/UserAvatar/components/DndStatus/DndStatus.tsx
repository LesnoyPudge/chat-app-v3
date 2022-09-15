import { FC } from 'react';
import { twMerge } from 'tailwind-merge';



interface IDndStatus {
    className?: string;
}

export const DndStatus: FC<IDndStatus> = ({ className }) => {
    return (
        <svg className={twMerge(`h-full w-full fill-status-dnd ${className}`)}>
            <rect className='h-full w-full' mask='url(#dnd-status-mask)'></rect>
        </svg>
    );
};