import { twClassNames } from '@utils';
import { FC } from 'react';



interface OnlineStatus {
    className?: string;
}

const styles = {
    base: 'bg-status-online w-full h-full rounded-full shrink-0',
};

export const OnlineStatus: FC<OnlineStatus> = ({ className }) => {
    return (
        <div className={twClassNames(styles.base, className)}></div>
    );
};