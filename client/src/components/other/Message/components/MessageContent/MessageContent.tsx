import { IMessage } from '@backendTypes';
import { Conditional, EmojiCode } from '@components';
import { SerializedSlateContent } from '@libs';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { Ids, MessageContext } from '../../Message';
import { MessageEditTimestamp } from '../MessageEditTimestamp';



interface MessageContent extends PropsWithClassName {
    message: IMessage & {
        reactions: {
            code: EmojiCode;
            users: string[];
        }[];
    };
    isInEditMode: boolean;
    ids: Ids;
}

const styles = {
    wrapper: 'inline message-font-size',
};

export const MessageContent: FC<MessageContent> = ({
    className = '',
    ids,
    isInEditMode,
    message,
}) => {
    return (
        <p 
            className={twClassNames(styles.wrapper, className)}
            id={ids.contentId}
        >
            <Conditional isRendered={!isInEditMode}>
                <SerializedSlateContent nodes={message.content}/>

                <MessageEditTimestamp
                    ids={ids}
                    message={message}
                />
            </Conditional>
        </p>
    );
};

// const styles = {
//     wrapper: 'inline message-font-size',
// };

// export const MessageContent: FC<PropsWithClassName> = ({
//     className = '',
// }) => {
//     const { ids, isInEditMode, message } = useContext(MessageContext) as MessageContext;

//     return (
//         <p 
//             className={twClassNames(styles.wrapper, className)}
//             id={ids.contentId}
//         >
//             <Conditional isRendered={!isInEditMode}>
//                 <SerializedSlateContent nodes={message.content}/>

//                 <MessageEditTimestamp/>
//             </Conditional>
//         </p>
//     );
// };