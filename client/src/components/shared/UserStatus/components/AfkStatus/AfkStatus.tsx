import { twClassNames } from '@utils';
import { FC } from 'react';



interface AfkStatus {
    className?: string;
}

const balseClassName = 'h-full w-full fill-status-afk shrink-0';

export const AfkStatus: FC<AfkStatus> = ({ className }) => {
    return (
        <svg className={twClassNames(balseClassName, className)} tabIndex={-1}>
            <rect 
                height='100%'
                width='100%'
                mask='url(#afk-status-mask)'
            ></rect>
        </svg>
    );
};