import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Conditional } from '@components';
import { DayDivider } from '../DayDivider';



interface HelloFromRoom extends PropsWithClassName {
    firstMessageCreationTimestamp?: number;
}

export const HelloFromRoom: FC<HelloFromRoom> = ({
    className = '',
    firstMessageCreationTimestamp,
}) => {
    return (
        <>
            <div 
                className={className}
                aria-hidden
            >
                <>Hello from room</>
            </div>

            <Conditional isRendered={!!firstMessageCreationTimestamp}>
                <DayDivider time={firstMessageCreationTimestamp || Date.now()}/>
            </Conditional>
        </>
    );
};