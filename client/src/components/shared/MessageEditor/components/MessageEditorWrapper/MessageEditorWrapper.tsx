import { twClassNames } from '@utils';
import { FC } from 'react';
import { styles } from '../../styles';
import { PropsWithChildrenAndClassName } from '@types';
import { Scrollable } from '@components';
import { useFocused } from 'slate-react';



export const MessageEditorWrapper: FC<PropsWithChildrenAndClassName> = ({
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