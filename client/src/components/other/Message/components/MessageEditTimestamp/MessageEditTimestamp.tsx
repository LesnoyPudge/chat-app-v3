import { FC, useContext } from 'react';
import { Time } from '@components';
import { MessageContext } from '../../Message';



const styles = {
    wrapper: 'leading-none text-xs text-color-muted',
};

export const MessageEditTimestamp: FC = () => {
    const { ids, message } = useContext(MessageContext) as MessageContext;

    return (
        <Time 
            className={styles.wrapper}
            date={message.updatedAt}
            id={ids.editTimestampId}
        >
            <> (изменено)</>
        </Time>
    );
};