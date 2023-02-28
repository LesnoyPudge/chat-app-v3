import { PropsWithClassName } from '@types';
import { FC, useContext } from 'react';
import { Time } from '@components';
import { MessageContext } from '../../Message';



export const MessageTimestamp: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { message, ids } = useContext(MessageContext) as MessageContext;

    return (
        <Time
            className={className}
            id={ids.timestampId}
            date={message.createdAt} 
            format='HH:mm'
        >
            {({ formattedTime }) => (
                <>{formattedTime}</>
            )}
        </Time>
    );
};