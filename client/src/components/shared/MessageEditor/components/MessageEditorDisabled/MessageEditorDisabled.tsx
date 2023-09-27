import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { styles } from '../../styles';



type MessageEditorDisabled = PropsWithClassName & {
    text: string;
}

export const MessageEditorDisabled: FC<MessageEditorDisabled> = ({
    className = '',
    text,
}) => {
    return (
        <div className={twClassNames(
            styles.wrapper,
            styles.sizeLimit,
            styles.disabled,
            className,
        )}>
            <div className={styles.disabledText}>
                {text}
            </div>
        </div>
    );
};
