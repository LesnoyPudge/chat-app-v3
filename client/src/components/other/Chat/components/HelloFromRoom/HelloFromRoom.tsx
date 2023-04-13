import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Static } from '@components';




export const HelloFromRoom: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <Static>
            <div 
                className={className}
                aria-hidden
            >
                <>Hello from room</>
            </div>
        </Static>
    );
};