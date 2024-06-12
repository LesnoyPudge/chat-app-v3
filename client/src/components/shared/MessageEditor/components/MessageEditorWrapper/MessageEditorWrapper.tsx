import { cn, twClassNames } from '@utils';
import { FC } from 'react';
import { styles } from '../../styles';
import { PropsWithChildrenAndClassName } from '@types';
import { Memo, Scrollable } from '@components';
import { useFocused } from 'slate-react';
import { Form } from 'formik';



export const MessageEditorWrapper: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    const isEditorFocused = useFocused();
    const styles2 = {
        wrapper: 'px-4 pt-4 pb-6',
    }
    
    return (
        <Form className={cn(styles2.wrapper, className)}>
            <div className={twClassNames(
                styles.wrapper,
                { [styles.editorFocused]: isEditorFocused },
            )}>
                <Memo>
                    <Scrollable
                        className={styles.sizeLimit}
                        followContentSize
                        small
                        withOppositeGutter
                        autoHide
                    >
                        {children}
                    </Scrollable>
                </Memo>
            </div>
        </Form>
    );
};