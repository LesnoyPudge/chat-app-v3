import { Conditional } from '@components';
import { SerializedSlateContent } from '@libs';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { MessageContext } from '../../Message';
import { MessageEditTimestamp } from '../MessageEditTimestamp';



const styles = {
    wrapper: 'inline message-font-size',
};

export const MessageContent: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { ids, isInRedactorMode, message } = useContext(MessageContext) as MessageContext;

    return (
        <p 
            className={twClassNames(styles.wrapper, className)}
            id={ids.contentId}
        >
            <Conditional isRendered={!isInRedactorMode}>
                <SerializedSlateContent nodes={message.content}/>

                <MessageEditTimestamp/>
            </Conditional>
        </p>
    );
};