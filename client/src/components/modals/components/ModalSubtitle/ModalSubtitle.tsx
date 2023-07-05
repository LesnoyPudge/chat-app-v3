import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    base: 'text-color-secondary text-center',
};

export const ModalSubtitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(styles.base, className)}>
            {children}
        </div>
    );
};