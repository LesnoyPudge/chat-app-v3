import { FC, useContext } from 'react';
import { EmojiCode, Time } from '@components';
import { Ids, MessageContext } from '../../Message';
import { isToday, isYesterday, lightFormat } from 'date-fns';
import { conditional } from '@utils';
import { IMessage } from '@backendTypes';



interface MessageCozyTimestamp {
    message: IMessage & {reactions: {code: EmojiCode, users: string[]}[]};
    ids: Ids;
}

const styles = {
    wrapper: 'text-xs text-color-muted font-medium self-center',
};

export const MessageCozyTimestamp: FC<MessageCozyTimestamp> = ({
    ids,
    message,
}) => {

    const yesterdayText = lightFormat(message.createdAt, '\'Вчера в\' H:m');
    const todayText = lightFormat(message.createdAt, '\'Сегодня в\' H:m');
    const isCreatedToday = isToday(message.createdAt);
    const isRelative = isCreatedToday || isYesterday(message.createdAt);
    const defaultText = lightFormat(message.createdAt, 'dd.MM.yyyy H:mm');

    const content = conditional(
        conditional(
            todayText, 
            yesterdayText, 
            isCreatedToday,
        ), 
        defaultText, 
        isRelative,
    );

    return (
        <Time
            className={styles.wrapper}
            id={ids.timestampId}
            date={message.createdAt}
        >
            {content}
        </Time>
    );
};

// const styles = {
//     wrapper: 'text-xs text-color-muted font-medium self-center',
// };

// export const MessageCozyTimestamp: FC = () => {
//     const { message, ids } = useContext(MessageContext) as MessageContext;

//     const yesterdayText = lightFormat(message.createdAt, '\'Вчера в\' H:m');
//     const todayText = lightFormat(message.createdAt, '\'Сегодня в\' H:m');
//     const isCreatedToday = isToday(message.createdAt);
//     const isRelative = isCreatedToday || isYesterday(message.createdAt);
//     const defaultText = lightFormat(message.createdAt, 'dd.MM.yyyy H:mm');

//     const content = conditional(
//         conditional(
//             todayText, 
//             yesterdayText, 
//             isCreatedToday,
//         ), 
//         defaultText, 
//         isRelative,
//     );

//     return (
//         <Time
//             className={styles.wrapper}
//             id={ids.timestampId}
//             date={message.createdAt}
//         >
//             {content}
//         </Time>
//     );
// };