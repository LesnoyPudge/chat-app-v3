import { FC, useContext } from 'react';
import { Time } from '@components';
import { MessageContext } from '../../Message';
import { isToday, isYesterday, lightFormat } from 'date-fns';
import { conditional } from '@utils';



const styles = {
    wrapper: 'text-xs text-color-muted font-medium self-center',
};

export const MessageCozyTimestamp: FC = () => {
    const { message, ids } = useContext(MessageContext);

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