import { FC, useContext } from 'react';
import {  Time } from '@components';
import { MessageContext } from '../../Message';



const styles = {
    wrapper: 'leading-none text-xs text-color-muted',
};

export const MessageEditTimestamp: FC = () => {
    const { ids, message } = useContext(MessageContext);

    return (
        <If condition={message.isChanged}>
            <Time 
                className={styles.wrapper}
                date={message.updatedAt}
                id={ids.editTimestampId}
            >
                <> (изменено)</>
            </Time>
        </If>
    );
};