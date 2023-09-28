import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { styles } from '../../styles';



export const MessageEditorDisabled: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(
            styles.wrapper,
            styles.sizeLimit,
            styles.disabled,
            className,
        )}>
            <div className={styles.disabledText}>
                {children}
            </div>
        </div>
    );
};
