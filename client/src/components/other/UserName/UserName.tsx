import { PropsWithClassName } from '@types';
import { FC } from 'react';



interface UserName extends PropsWithClassName {
    userId: string;
    channelId: string;
}

export const UserName: FC<UserName> = ({
    className = '',
    channelId,
    userId,
}) => {


    return (
        <div className={className}>
            <>loshok111</>
        </div>
    );
};