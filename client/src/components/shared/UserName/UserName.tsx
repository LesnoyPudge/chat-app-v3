import { PropsWithClassName } from '@types';
import { FC } from 'react';



type UserName = PropsWithClassName

export const UserName: FC<UserName> = ({
    className = '',
    // channelId,
    // userId,
}) => {


    return (
        <div className={className}>
            <>loshok111</>
        </div>
    );
};