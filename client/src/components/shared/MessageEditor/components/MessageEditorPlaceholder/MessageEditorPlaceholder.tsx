import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Placeholder } from '@components';
import { styles } from '../../styles';



export const MessageEditorPlaceholder: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <Placeholder className={twClassNames(
            styles.wrapper,
            styles.sizeLimit,
            className,
        )}/>
    );
};