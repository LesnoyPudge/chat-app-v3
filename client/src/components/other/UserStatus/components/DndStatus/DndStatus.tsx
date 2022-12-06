import { twClassNames } from '@utils';
import { FC } from 'react';



interface IDndStatus {
    className?: string;
}

const balseClassName = 'h-full w-full fill-status-dnd shrink-0';

export const DndStatus: FC<IDndStatus> = ({ className }) => {
    return (
        <svg className={twClassNames(balseClassName, className)} tabIndex={-1}>
            <rect 
                height='100%'
                width='100%' 
                mask='url(#dnd-status-mask)'
            ></rect>
        </svg>
    );
};