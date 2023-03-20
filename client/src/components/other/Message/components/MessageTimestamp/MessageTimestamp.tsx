import { PropsWithClassName } from '@types';
import { FC, useContext } from 'react';
import { EmojiCode, Time } from '@components';
import { Ids, MessageContext } from '../../Message';
import { IMessage } from '@backendTypes';



interface MessageTimestamp extends PropsWithClassName {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    ids: Ids;
}

export const MessageTimestamp: FC<MessageTimestamp> = ({
    className = '',
    ids,
    message,
}) => {
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

// export const MessageTimestamp: FC<PropsWithClassName> = ({
//     className = '',
// }) => {
//     const { message, ids } = useContext(MessageContext) as MessageContext;

//     return (
//         <Time
//             className={className}
//             id={ids.timestampId}
//             date={message.createdAt} 
//             format='HH:mm'
//         >
//             {({ formattedTime }) => (
//                 <>{formattedTime}</>
//             )}
//         </Time>
//     );
// };