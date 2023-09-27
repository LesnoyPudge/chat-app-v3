import { twClassNames } from '@utils';
import { FC } from 'react';
import { styles } from '../../styles';
import { PropsWithChildrenAndClassName } from '@types';
import { Scrollable } from '@components';
import { useFocused } from 'slate-react';



type MessageEditorWrapper = PropsWithChildrenAndClassName & {
    with?: boolean;
}

export const MessageEditorWrapper: FC<MessageEditorWrapper> = ({
    className = '',
    children,
}) => {
    const isEditorFocused = useFocused();

    return (
        <div className={twClassNames(
            styles.wrapper,
            { [styles.editorFocused]: isEditorFocused },
            className,
        )}>
            <Scrollable
                className={styles.sizeLimit}
                followContentSize
                small
                withOppositeGutter
                autoHide
            >
                {children}
            </Scrollable>
        </div>
    );
};