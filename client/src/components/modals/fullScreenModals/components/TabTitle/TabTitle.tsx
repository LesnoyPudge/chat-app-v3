import { Heading } from '@libs';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {
    base: 'text-color-primary font-semibold text-heading-l mb-5',
};

export const TabTitle: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <Heading className={twClassNames(styles.base, className)}>
            {children}
        </Heading>
    );
};