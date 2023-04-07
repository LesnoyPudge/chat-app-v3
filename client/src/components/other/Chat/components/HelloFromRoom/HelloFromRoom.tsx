import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Conditional } from '@components';
import { DayDivider } from '../DayDivider';




export const HelloFromRoom: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <>
            <div 
                className={className}
                aria-hidden
            >
                <>Hello from room</>
            </div>
        </>
    );
};