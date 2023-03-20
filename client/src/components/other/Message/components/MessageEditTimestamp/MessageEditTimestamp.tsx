import { FC, useContext } from 'react';
import { Conditional, EmojiCode, Time } from '@components';
import { Ids, MessageContext } from '../../Message';
import { IMessage } from '@backendTypes';



interface MessageEditTimestamp {
    message: IMessage & {
        reactions: {
            code: EmojiCode;
            users: string[];
        }[];
    };
    ids: Ids;
}

const styles = {
    wrapper: 'leading-none text-xs text-color-muted',
};

export const MessageEditTimestamp: FC<MessageEditTimestamp> = ({
    message,
    ids,
}) => {
    return (
        <Conditional isRendered={message.isChanged}>
            <Time 
                className={styles.wrapper}
                date={message.updatedAt}
                id={ids.editTimestampId}
            >
                <> (изменено)</>
            </Time>
        </Conditional>
    );
};

// const styles = {
//     wrapper: 'leading-none text-xs text-color-muted',
// };

// export const MessageEditTimestamp: FC = () => {
//     const { ids, message } = useContext(MessageContext) as MessageContext;

//     return (
//         <Conditional isRendered={message.isChanged}>
//             <Time 
//                 className={styles.wrapper}
//                 date={message.updatedAt}
//                 id={ids.editTimestampId}
//             >
//                 <> (изменено)</>
//             </Time>
//         </Conditional>
//     );
// };