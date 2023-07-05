import { HeadingLevel } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    base: 'flex flex-col pb-4 px-4',
};

export const ModalContent: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <HeadingLevel>
            <div className={twClassNames(styles.base, className)}>
                {children}
            </div>
        </HeadingLevel>
    );
};