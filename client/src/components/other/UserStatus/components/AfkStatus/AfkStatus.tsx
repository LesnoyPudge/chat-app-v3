import { twClassNames } from '@utils';
import { FC } from 'react';



interface IAfkStatus {
    className?: string;
}

const balseClassName = 'h-full w-full fill-status-afk shrink-0';

export const AfkStatus: FC<IAfkStatus> = ({ className }) => {
    return (
        <svg className={twClassNames(balseClassName, className)}>
            <rect 
                height='100%'
                width='100%'
                mask='url(#afk-status-mask)'
            ></rect>
        </svg>
    );
};